import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionExportGQL, SessionCsvExportGQL, MarkerType } from '../../../graphql/generated/graphql';
import { Session } from '../types/session.entity';
import { Marker } from '../types/marker.entity';
import { UserSession } from '../types/user-session.entity';
import { MarkerService } from '../../markers/services/marker.service';

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
export class SessionExportService {
  constructor(
    private sessionExportGQL: SessionExportGQL,
    private sessionCSVExportGQL: SessionCsvExportGQL,
    private readonly markerService: MarkerService
  ) {}

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
