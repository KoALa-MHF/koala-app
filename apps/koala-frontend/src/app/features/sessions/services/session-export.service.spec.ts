import { of, throwError } from 'rxjs';
import {
  Marker,
  MarkerType,
  Role,
  Session,
  SessionCsvExportGQL,
  SessionExportGQL,
} from '../../../graphql/generated/graphql';
import { MarkerService } from '../../markers/services/marker.service';
import { SessionExportService } from './session-export.service';

describe('createSessionCSV', () => {
  let service: SessionExportService;
  let sessionExportGQL: SessionExportGQL;
  let sessionCSVExportGQL: SessionCsvExportGQL;
  let markerService: MarkerService;

  beforeEach(() => {
    sessionExportGQL = jest.fn() as any;
    sessionCSVExportGQL = jest.fn() as any;
    markerService = jest.fn() as any;
    service = new SessionExportService(sessionExportGQL, sessionCSVExportGQL, markerService);
  });

  it('should return a CSV string when given a valid session ID', async () => {
    // Arrange
    const sessionId = 1;
    //create seed data for Session and Marker
    const mockSession: Session = {
      id: '1',
      name: 'Test Session',
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: {
        createdAt: new Date(),
        displayName: 'John Doe',
        email: '',
        id: '1',
        role: Role.User,
        updatedAt: new Date(),
      },
      toolbars: [
        {
          id: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          markers: [
            {
              markerId: '1',
              visible: true,
            },
            {
              markerId: '2',
              visible: true,
            },
          ],
        },
      ],
      code: '',
      currentSessionServerTime: 0,
      isAudioSession: false,
      isSessionOwner: false,
      userSessions: [],
    };

    const mockMarkers: Marker[] = [
      {
        id: 1,
        name: 'Test Marker',
        type: MarkerType.Event,
        color: '#000000',
        contentColor: '',
        createdAt: new Date(),
        owner: {
          createdAt: new Date(),
          displayName: 'John Doe',
          email: 'john.doe@example.com',
          id: 'user1',
          role: Role.User,
          updatedAt: new Date(),
        },
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Test Marker 2',
        type: MarkerType.Range,
        color: '#FF0000',
        contentColor: '',
        createdAt: new Date(),
        owner: {
          createdAt: new Date(),
          displayName: 'Jane Smith',
          email: 'jane.smith@example.com',
          id: 'user2',
          role: Role.User,
          updatedAt: new Date(),
        },
        updatedAt: new Date(),
      },
    ];

    sessionCSVExportGQL.fetch = jest.fn().mockReturnValue(of({ data: { session: mockSession } }));
    markerService.getAll = jest.fn().mockReturnValue(of({ data: { markers: mockMarkers } }));

    // Act
    const result = await service.createSessionCSV(sessionId);

    // Assert
    expect(typeof result).toBe('string');
    expect(sessionCSVExportGQL.fetch).toHaveBeenCalledWith({ sessionId }, { fetchPolicy: 'no-cache' });
    expect(markerService.getAll).toHaveBeenCalled();
  });

  it('should throw an error when given an invalid session ID', async () => {
    // Arrange
    const sessionId = -1;
    sessionCSVExportGQL.fetch = jest.fn().mockReturnValue(throwError(() => new Error('Error')));

    // Act
    try {
      await service.createSessionCSV(sessionId);
    } catch (error) {
      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(sessionCSVExportGQL.fetch).toHaveBeenCalledWith({ sessionId }, { fetchPolicy: 'no-cache' });
    }
  });
});
