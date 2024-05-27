import { Injectable } from '@angular/core';
import { MutationResult } from 'apollo-angular';
import { Observable, Subject, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  CreateNewSessionGQL,
  DeleteSessionGQL,
  GetSessionsGQL,
  GetOneSessionGQL,
  UpdateSessionGQL,
  UpdateSessionInput,
  CreateSessionInput,
  OnSessionUpdatedGQL,
  CreateNewSessionMutation,
  GetOneSessionBySessionCodeGQL,
  SetPlayModeGQL,
  SetPlayPositionGQL,
  SetPlayModeInput,
  ToolbarMarker,
  SessionExportGQL,
  SessionCsvExportGQL,
  MarkerType,
  PlayMode,
} from '../../../graphql/generated/graphql';
import { Session } from '../types/session.entity';
import { ToolbarsService } from './toolbars.service';
import { MarkerService } from '../../markers/services/marker.service';
import { Marker } from '../types/marker.entity';
import { UserSession } from '../types/user-session.entity';

interface AnnotationCSVExport {
  timestamp: number;
  value: number;
  markerType: MarkerType;
  markerId: number;
  userIndex: number;
}

interface CSVColumn {
  title: string;
  markerId: number;
  userIndex: number;
  markerType: MarkerType | null;
}

const eventMarkerPressed = 1;
const eventMarkerNotPressed = 0;
const rangeMarkerActivated = 1;
const rangeMarkerDeactivated = 0;
const sliderInactive = 2021;
const notDefined = 2016;
const csvSeparator = ',';
const csvNewLine = '\n';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  private localPlayMode = PlayMode.Paused;
  private focusSession?: Session;

  private focusSessionSubject = new Subject<Session>();
  public focusSessionChanged$ = this.focusSessionSubject.asObservable();

  constructor(
    private readonly getSessionGQL: GetSessionsGQL,
    private readonly getOneSessionGQL: GetOneSessionGQL,
    private readonly createSessionGQL: CreateNewSessionGQL,
    private readonly updateSessionGQL: UpdateSessionGQL,
    private readonly deleteSessionGQL: DeleteSessionGQL,
    private readonly onSessionUpdatedGQL: OnSessionUpdatedGQL,
    private readonly getOneSessionBySessionCodeGQL: GetOneSessionBySessionCodeGQL,
    private readonly setPlayModeGQL: SetPlayModeGQL,
    private readonly setPlayPositionGQL: SetPlayPositionGQL,
    private readonly toolbarService: ToolbarsService,
    private readonly sessionExportGQL: SessionExportGQL,
    private readonly sessionCSVExportGQL: SessionCsvExportGQL,
    private readonly markerService: MarkerService
  ) {}

  getAll(): Observable<Session[]> {
    return this.getSessionGQL.fetch({}, { fetchPolicy: 'no-cache' }).pipe(map((data) => data.data.sessions));
  }

  getSessionIdBySessionCode(code: string): Observable<number> {
    return this.getOneSessionBySessionCodeGQL
      .fetch({ code }, { fetchPolicy: 'no-cache' })
      .pipe(map((response) => parseInt(response.data.sessionByCode.id)));
  }

  getOne(id: number): Observable<Session> {
    return this.getOneSessionGQL
      .fetch(
        {
          sessionId: id,
        },
        { fetchPolicy: 'no-cache' }
      )
      .pipe(map((data) => data.data.session));
  }

  create(session: CreateSessionInput) {
    return this.createSessionGQL.mutate({ session });
  }

  update(id: number, session: UpdateSessionInput) {
    return this.updateSessionGQL.mutate({
      id,
      session,
    });
  }

  delete(id: number) {
    return this.deleteSessionGQL.mutate({ id });
  }

  subscribeUpdated(id: number) {
    return this.onSessionUpdatedGQL
      .subscribe({
        sessionId: id.toString(),
      })
      .pipe(
        map((response) => {
          if (response.data) {
            const session: Session = response.data.sessionUpdated;
            if (session && this.focusSession && this.focusSession.id === session.id && this.focusSession.media) {
              //take over owner and isAudio information
              session.media = this.focusSession.media;
            }

            //keep isSessionOwner information in this case,
            //because the push comes from the session owner and the flag will be always true otherwise
            session.isSessionOwner = this.focusSession?.isSessionOwner;

            return session;
          } else {
            throw new Error('Session Response Empty After Session Update');
          }
        })
      )
      .subscribe({
        next: (session?: Session) => {
          this.setFocusSession(parseInt(session?.id || '0')).subscribe();
        },
      });
  }

  copySession(sessionId: number): Promise<Session | null> {
    let sourceMarkers: ToolbarMarker[] | null | undefined;
    return new Promise<Session | null>((resolve, reject) => {
      this.getOne(sessionId).subscribe({
        next: (session: Session) => {
          if (session.toolbars) {
            sourceMarkers = session.toolbars[0].markers;
          }

          this.createSessionGQL
            .mutate({
              session: {
                name: session.name + ' Copy',
                description: session.description,
                displaySampleSolution: session.displaySampleSolution,
                editable: session.editable,
                enableLiveAnalysis: session.enableLiveAnalysis,
                enablePlayer: session.enablePlayer,
                end: session.end,
                start: session.start,
              },
            })
            .subscribe({
              next: (newSessionResult: MutationResult<CreateNewSessionMutation>) => {
                const newToolbar = newSessionResult.data?.createSession.toolbars[0];

                if (newToolbar && sourceMarkers) {
                  this.toolbarService
                    .update(parseInt(newToolbar.id), {
                      markers: sourceMarkers.map((marker) => marker.markerId),
                    })
                    .subscribe(() => {
                      resolve(newSessionResult.data?.createSession || null);
                    });
                } else {
                  resolve(newSessionResult.data?.createSession || null);
                }
              },
              error: () => {
                reject();
              },
            });
        },
      });
    });
  }

  setPlayMode(sessionId: number, playModeInput: SetPlayModeInput) {
    if (this.focusSession?.enablePlayer) {
      //local player management, no global playMode change
      this.localPlayMode = playModeInput.playMode || PlayMode.Paused;
      return of({ ...this.focusSession, playMode: PlayMode.Running } as Session);
    } else {
      this.localPlayMode = PlayMode.Paused;
      return this.setPlayModeGQL.mutate({ sessionId, setPlayModeInput: playModeInput }).pipe(
        map((response) => {
          const session = response.data?.setPlayMode;
          if (session) {
            return session as Session;
          } else {
            throw new Error('Session Response Empty After SetPlayMode');
          }
        })
      );
    }
  }

  setPlayPosition(sessionId: number, playPosition: number) {
    return this.setPlayPositionGQL.mutate({ sessionId, setPlayPositionInput: { playPosition } }).pipe(
      map((response) => {
        const session = response.data?.setPlayPosition;
        if (session) {
          return session;
        } else {
          throw new Error('Session Response Empty After SetPlayPosition');
        }
      })
    );
  }

  setFocusSession(sessionId: number) {
    return this.getOne(sessionId).pipe(
      tap((session: Session) => {
        this.focusSession = session;
        if (this.focusSession?.enablePlayer) {
          //mix in local play mode
          this.focusSession.playMode = this.localPlayMode;
        }
        this.focusSessionSubject.next(this.focusSession);
      })
    );
  }

  getFocusSession(): Session | undefined {
    return this.focusSession;
  }

  createSessionJSON(sessionId: number): Observable<Session> {
    return this.sessionExportGQL
      .fetch({ sessionId }, { fetchPolicy: 'no-cache' })
      .pipe(map((data) => data.data.session));
  }

  createSessionCSV(sessionId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.sessionCSVExportGQL
        .fetch({ sessionId }, { fetchPolicy: 'no-cache' })
        .pipe(map((data) => data.data.session))
        .subscribe({
          next: async (session) => {
            //get all markers for session
            const markerIds = session.toolbars[0].markers?.map((marker) => parseInt(marker.markerId)) || [];
            const markers = await this.getAllMarkersForSession(markerIds);

            const ownerUserSession = session.userSessions.find((userSession) => {
              return userSession.owner.id === session.owner.id;
            });

            //create header columns
            const csvHeaderColumns = this.createCSVHeaderRow(markers, session.userSessions, ownerUserSession?.id || 0);

            //create annotation rows
            const transformedAnnotations = this.transformAnnotationstoCSVValues(session.userSessions);
            const annotationRows = this.buildCSVRowsFromAnnotations(transformedAnnotations, csvHeaderColumns);

            //combine in CSV string
            const csvString =
              `SEP=${csvSeparator}${csvNewLine}` +
              csvHeaderColumns.map((csvHeaderColumn) => csvHeaderColumn.title).join(csvSeparator) +
              csvNewLine +
              annotationRows.join(csvNewLine);
            resolve(csvString);
          },
          error: () => {
            reject();
          },
        });
    });
  }

  private createCSVHeaderRow(markers: Marker[], userSessions: UserSession[], ownerUserSessionId: number): CSVColumn[] {
    const columns: CSVColumn[] = [
      {
        title: 'timestamp (in ms)',
        markerType: null,
        markerId: 0,
        userIndex: -1,
      },
    ];

    let userCounter = 1;

    userSessions.forEach((userSession, index) => {
      let userDescription = 'user' + userCounter;
      if (userSession.id === ownerUserSessionId) {
        userDescription = 'owner';
      } else {
        userCounter++;
      }

      markers.forEach((marker) => {
        columns.push({
          title: userDescription + '_' + marker.name,
          markerType: marker.type,
          markerId: marker.id,
          userIndex: index,
        });
      });
    });

    return columns;
  }

  private getAllMarkersForSession(markerIds: number[]): Promise<Marker[]> {
    return new Promise((resolve, reject) => {
      const markers: Marker[] = [];
      this.markerService.getAll(markerIds).subscribe({
        next: (result) => {
          //take read markers and put them in sorting order from toolbar
          const allMarkers = result.data?.markers;

          if (allMarkers) {
            markerIds.forEach((markerId) => {
              for (let i = 0; i < allMarkers.length; i++) {
                if (allMarkers[i].id === markerId) {
                  markers.push(allMarkers[i]);
                }
              }
            });
          }

          resolve(markers);
        },
        error: () => {
          reject();
        },
      });
    });
  }

  private transformAnnotationstoCSVValues(userSessions: UserSession[]) {
    const cleanedupAnnotations: AnnotationCSVExport[] = [];

    userSessions.forEach((userSession, userIndex) => {
      userSession.annotations?.forEach((annotation) => {
        const annotationMarkerType = annotation.marker?.type;
        if (annotationMarkerType) {
          let cleanedUpValue = 0;
          switch (annotationMarkerType) {
            case MarkerType.Event:
              cleanedUpValue = eventMarkerPressed;
              break;

            case MarkerType.Range:
              cleanedUpValue = rangeMarkerActivated;
              break;

            case MarkerType.Slider:
              cleanedUpValue = annotation.value || 0;
              break;

            default:
              break;
          }

          const newCleanedUpAnnotationFromStart: AnnotationCSVExport = {
            timestamp: annotation.start,
            markerType: annotationMarkerType,
            value: cleanedUpValue,
            markerId: annotation.marker?.id || 0,
            userIndex: userIndex,
          };
          cleanedupAnnotations.push(newCleanedUpAnnotationFromStart);

          if (annotation.end) {
            switch (annotationMarkerType) {
              case MarkerType.Event:
                cleanedUpValue = eventMarkerNotPressed;
                break;

              case MarkerType.Range:
                cleanedUpValue = rangeMarkerDeactivated;
                break;

              case MarkerType.Slider:
                cleanedUpValue = sliderInactive;
                break;

              default:
                break;
            }
            const newCleanedUpAnnotationFromEnd: AnnotationCSVExport = {
              timestamp: annotation.end,
              markerType: annotationMarkerType,
              value: cleanedUpValue,
              markerId: annotation.marker?.id || 0,
              userIndex: userIndex,
            };
            cleanedupAnnotations.push(newCleanedUpAnnotationFromEnd);
          }
        }
      });
    });

    return cleanedupAnnotations;
  }

  private buildCSVRowsFromAnnotations(annotations: AnnotationCSVExport[], csvHeaderColumns: CSVColumn[]): string[] {
    const annotationRows: Array<string[]> = [];
    const csvDataRows: string[] = [];

    //fill first column with timestamp info and initialize all columns respecting their marker type
    annotations.forEach((annotation) => {
      if (!annotationRows[annotation.timestamp]) {
        annotationRows[annotation.timestamp] = [];
        annotationRows[annotation.timestamp][0] = annotation.timestamp.toString();

        csvHeaderColumns.forEach((csvHeaderColumn, index) => {
          if (csvHeaderColumn.markerType !== null) {
            annotationRows[annotation.timestamp][index] =
              csvHeaderColumn.markerType === MarkerType.Event
                ? eventMarkerNotPressed.toString()
                : csvHeaderColumn.markerType === MarkerType.Range
                ? notDefined.toString()
                : notDefined.toString();
          }
        });
      }
    });

    annotations.forEach((annotation) => {
      //find csv column for annotation
      const columnIndex = csvHeaderColumns.findIndex((csvHeaderColumn) => {
        return csvHeaderColumn.markerId === annotation.markerId && csvHeaderColumn.userIndex === annotation.userIndex;
      });
      annotationRows[annotation.timestamp][columnIndex] = annotation.value.toString();
    });

    let formerAnnotationRow: string[];
    annotationRows.forEach((annotationRow) => {
      annotationRow.forEach((annotationCell, cellIndex) => {
        const markerType = csvHeaderColumns[cellIndex].markerType;

        //take over former value in case of range and slider
        //nothing to do for event markers
        if (formerAnnotationRow) {
          if (markerType === MarkerType.Range) {
            if (annotationCell === notDefined.toString()) {
              if (formerAnnotationRow[cellIndex] === rangeMarkerActivated.toString()) {
                //copy activated information here in case there range was not explicitely deactivated
                annotationRow[cellIndex] = rangeMarkerActivated.toString();
              } else {
                annotationRow[cellIndex] = rangeMarkerDeactivated.toString();
              }
            }
          } else if (markerType === MarkerType.Slider) {
            if (annotationCell === notDefined.toString()) {
              if (formerAnnotationRow[cellIndex] !== notDefined.toString()) {
                //copy activated information here in case there range was not explicitely deactivated
                annotationRow[cellIndex] = formerAnnotationRow[cellIndex];
              } else {
                annotationRow[cellIndex] = sliderInactive.toString();
              }
            }
          }
        } else {
          if (markerType === MarkerType.Range && annotationRow[cellIndex] !== rangeMarkerActivated.toString()) {
            annotationRow[cellIndex] = rangeMarkerDeactivated.toString();
          } else if (markerType === MarkerType.Slider && annotationRow[cellIndex] === notDefined.toString()) {
            annotationRow[cellIndex] = sliderInactive.toString();
          }
        }
      });
      formerAnnotationRow = annotationRow;

      csvDataRows.push(annotationRow.join(csvSeparator));
    });

    return csvDataRows;
  }
}
