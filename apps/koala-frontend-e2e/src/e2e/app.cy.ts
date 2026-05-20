import { pressHomeButton } from '../support/header.po';
import {
  getSessionDescriptionField,
  getSessionNameField,
  getEditableCheckbox,
  getPlayerCheckbox,
  getSampleSolutionCheckbox,
  getAnalysisCheckbox,
  getLiveSessionCheckbox,
  getAudioVideoTab,
  pressAudioTab,
  getMediaDeleteButton,
  pressMediaDeleteButton,
  confirmMediaDelete,
  cancelMediaDeleteConfirm,
} from '../support/session-manage.po';
import {
  pressCreateSessionButton,
  getSessionOverviewTableRows,
  pressAllDeleteSessionButtons,
  pressEditOnSession,
  pressDeleteOneSession,
  pressDialogCreateSessionButton,
  getDialogCreateSessionButton,
  getCreateSessionNameField,
  getSessionOverviewTableRow,
  confirmDeleteSession,
  cancelDeleteConfirm,
} from '../support/session-overview.po';
import {
  pressParticipantsTab,
  getParticipantTableRows,
  pressAddParticipantButton,
  getParticipantEmailInput,
  getParticipantDialogCreateButton,
  pressParticipantDialogCreateButton,
  pressParticipantDialogCancelButton,
  pressParticipantDeleteButton,
  confirmParticipantDelete,
  cancelParticipantDeleteConfirm,
} from '../support/participants.po';
import {
  pressMarkerTab,
  selectMarkerType,
  getMarkerNameInput,
  getMarkerDescriptionInput,
  getMarkerAbbreviationInput,
  getMarkerValueRangeFromInput,
  getMarkerValueRangeToInput,
  getMarkerColorTextInput,
  getMarkerContentColorSwitch,
  selectFirstMarkerIcon,
  getMarkerAddButton,
  pressMarkerAddButton,
  pressMarkerResetButton,
  getMarkerToolbarItems,
  getMarkerToolbarItem,
  dragMarkerToolbarItem,
} from '../support/marker.po';

describe('koala-frontend', () => {
  beforeEach(() => {
    cy.intercept('/graphql', (req) => {
      req.alias = 'api';
      if ((req.body as { operationName?: string })?.operationName === 'GetSessions') {
        req.alias = 'getSessions';
      }
    });
    cy.task<string>('generateAuthToken', 1).then((token) => {
      cy.visit('/', {
        onBeforeLoad(win) {
          win.sessionStorage.setItem('koala-user', JSON.stringify({ accessToken: token }));
        },
      });
    });
    // Wait specifically for GetSessions so the table is rendered before cleanup
    cy.wait('@getSessions');
    pressAllDeleteSessionButtons();
  });

  it('Create/update session with basic session data', () => {
    getSessionOverviewTableRows().should((t) => expect(t.length).equal(1));
    pressCreateSessionButton();

    getDialogCreateSessionButton().should('be.disabled');

    getCreateSessionNameField().type('New Session');
    pressDialogCreateSessionButton();

    // Session maintain page opens after creation — fields are auto-saved on change
    getSessionNameField().clear().type('Updated Session');
    getSessionDescriptionField().type('Session Description');

    getEditableCheckbox().click();
    getPlayerCheckbox().click();
    getSampleSolutionCheckbox().click();
    getAnalysisCheckbox().click();
    getLiveSessionCheckbox().click();

    pressHomeButton();

    getSessionOverviewTableRows().should((t) => expect(t.length).equal(2));

    getSessionOverviewTableRow(1)
      .find('[data-cy="session-overview-name-col"]')
      .should('contain.text', 'Updated Session');
    getSessionOverviewTableRow(1).find('[data-cy="session-overview-created-at-col"]').should('not.be.empty');
    getSessionOverviewTableRow(1).find('[data-cy="session-overview-updated-at-col"]').should('not.be.empty');

    //check if all data was stored correctly
    pressEditOnSession(0);

    getSessionNameField().should('have.value', 'Updated Session');
    getSessionDescriptionField().should('have.value', 'Session Description');
    getEditableCheckbox().should('have.class', 'p-checkbox-checked');
    getPlayerCheckbox().should('have.class', 'p-checkbox-checked');
    getSampleSolutionCheckbox().should('have.class', 'p-checkbox-checked');
    getAnalysisCheckbox().should('have.class', 'p-checkbox-checked');
    getLiveSessionCheckbox().should('have.class', 'p-checkbox-checked');

    //update session
    getSessionNameField().clear().type('Second Updated Session');
    getSessionDescriptionField().clear().type('Updated Description');
    //deselect checkboxes
    getEditableCheckbox().click();
    getPlayerCheckbox().click();
    getSampleSolutionCheckbox().click();
    getAnalysisCheckbox().click();
    getLiveSessionCheckbox().click();

    pressHomeButton();

    getSessionOverviewTableRows().should((t) => expect(t.length).equal(2));

    getSessionOverviewTableRow(1)
      .find('[data-cy="session-overview-name-col"]')
      .should('contain.text', 'Second Updated Session');
    getSessionOverviewTableRow(1).find('[data-cy="session-overview-created-at-col"]').should('not.be.empty');
    getSessionOverviewTableRow(1).find('[data-cy="session-overview-updated-at-col"]').should('not.be.empty');

    //check if all data was stored correctly
    pressEditOnSession(0);

    getSessionNameField().should('have.value', 'Second Updated Session');
    getSessionDescriptionField().should('have.value', 'Updated Description');
    getEditableCheckbox().should('not.have.class', 'p-checkbox-checked');
    getPlayerCheckbox().should('not.have.class', 'p-checkbox-checked');
    getSampleSolutionCheckbox().should('not.have.class', 'p-checkbox-checked');
    getAnalysisCheckbox().should('not.have.class', 'p-checkbox-checked');
    getLiveSessionCheckbox().should('not.have.class', 'p-checkbox-checked');
  });

  /*it('Create session with markers', () => {
    getSessionOverviewTableRows().should((t) => expect(t.length).equal(1));
    pressCreateSessionButton();

    getDialogCreateSessionButton().should('be.disabled');

    getCreateSessionNameField().type('New Session');
    pressDialogCreateSessionButton();

    pressHomeButton();

    getSessionOverviewTableRows().should((t) => expect(t.length).equal(2));
  });

  it('Create session with audio', () => {
    getSessionOverviewTableRows().should((t) => expect(t.length).equal(1));
    pressCreateSessionButton();

    getDialogCreateSessionButton().should('be.disabled');

    getCreateSessionNameField().type('New Session');
    pressDialogCreateSessionButton();

    pressHomeButton();

    getSessionOverviewTableRows().should((t) => expect(t.length).equal(2));
  });

  it('Update session', () => {
    pressCreateSessionButton();

    getCreateSessionNameField().type('New Session');
    pressSaveButton();

    pressEditOnSession(0);

    getCreateSessionNameField().type('New Session - Update');
    pressSaveButton();

    cy.contains('New Session - Update');
  });*/

  it('Audio/Video tab is hidden when live session is checked and visible when unchecked', () => {
    pressCreateSessionButton();
    getCreateSessionNameField().type('Live Session Tab Test');
    pressDialogCreateSessionButton();
    cy.url().should('include', '/sessions/update/');

    getAudioVideoTab().should('exist');

    getLiveSessionCheckbox().click();
    getAudioVideoTab().should('not.exist');

    getLiveSessionCheckbox().click();
    getAudioVideoTab().should('exist');
  });

  it('Delete media file confirmation dialog cancels and confirms correctly', () => {
    // Intercept GetOneSession to inject fake media, and stub deleteMedia to succeed
    cy.intercept('POST', '/graphql', (req) => {
      const body = req.body as { operationName?: string; query?: string };
      if (body?.operationName === 'GetOneSession') {
        req.continue((res) => {
          if (res.body?.data?.session) {
            res.body.data.session.media = {
              __typename: 'Media',
              id: '1',
              name: 'test-audio.mp3',
              mimeType: 'audio/mpeg',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          }
        });
      } else if (body?.query?.includes('deleteMedia')) {
        req.alias = 'deleteMedia';
        req.reply({ body: { data: { deleteMedia: { id: '1' } } } });
      }
    });

    pressCreateSessionButton();
    getCreateSessionNameField().type('Session With Media');
    pressDialogCreateSessionButton();
    cy.url().should('include', '/sessions/update/');
    pressAudioTab();

    // Delete button must be enabled (media was injected into the session response)
    getMediaDeleteButton().should('not.be.disabled');

    // Cancel path: dialog appears but cancel closes it without deletion
    pressMediaDeleteButton();
    cy.get('.p-confirm-dialog').should('be.visible');
    cancelMediaDeleteConfirm();
    cy.get('.p-confirm-dialog').should('not.exist');
    getMediaDeleteButton().should('not.be.disabled');

    // Confirm path: dialog appears and confirming triggers the delete API call
    pressMediaDeleteButton();
    cy.get('.p-confirm-dialog').should('be.visible');
    confirmMediaDelete();
    cy.wait('@deleteMedia');
    cy.contains('Datei gelöscht').should('be.visible');
  });

  it('Marker tab - create one marker of each type and verify sorting in the toolbar', () => {
    cy.intercept('POST', '/graphql', (req) => {
      const body = req.body as { operationName?: string };
      if (body.operationName === 'createMarker') {
        req.alias = 'createMarker';
      }
      if (body.operationName === 'updateToolbar') {
        req.alias = 'updateToolbar';
      }
      if (body.operationName === 'GetMarkers') {
        req.alias = 'getMarkers';
      }
    });

    pressCreateSessionButton();
    getCreateSessionNameField().type('Marker Test Session');
    pressDialogCreateSessionButton();
    cy.url().should('include', '/sessions/update/');

    pressMarkerTab();

    // ── EVENT marker ──────────────────────────────────────────────────
    // Type dropdown opens and offers all three types
    selectMarkerType('Event');
    getMarkerNameInput().type('Event Marker');
    getMarkerDescriptionInput().type('An event marker description');
    getMarkerAbbreviationInput().type('EM'); // max 2 chars for EVENT
    // Color hex input
    getMarkerColorTextInput().clear().type('ff0000').trigger('change');
    // Content-color (dark/light text) switch
    getMarkerContentColorSwitch().click();
    // Icon selection (icon dropdown is visible for EVENT/RANGE)
    selectFirstMarkerIcon();
    // Add button is enabled because the form is valid
    getMarkerAddButton().should('not.be.disabled');
    pressMarkerAddButton();
    cy.wait('@createMarker');
    cy.wait('@updateToolbar');
    cy.wait('@getMarkers');
    cy.contains('Marker erfolgreich erstellt und der Session hinzugefügt').should('be.visible');

    // ── RANGE marker ──────────────────────────────────────────────────
    selectMarkerType('Range');
    getMarkerNameInput().type('Range Marker');
    getMarkerAbbreviationInput().type('RNG'); // max 6 chars for RANGE
    getMarkerAddButton().should('not.be.disabled');
    pressMarkerAddButton();
    cy.wait('@createMarker');
    cy.wait('@updateToolbar');
    cy.wait('@getMarkers');
    cy.contains('Marker erfolgreich erstellt und der Session hinzugefügt').should('be.visible');

    // ── SLIDER marker ─────────────────────────────────────────────────
    selectMarkerType('Slider');
    getMarkerNameInput().type('Slider Marker');
    // Abbreviation is mandatory for Slider type (max 6 chars)
    getMarkerAbbreviationInput().type('SLD');
    // valueRangeFrom/To fields only appear for Slider
    getMarkerValueRangeFromInput().clear().type('1');
    getMarkerValueRangeToInput().clear().type('20');
    getMarkerAddButton().should('not.be.disabled');
    pressMarkerAddButton();
    cy.wait('@createMarker');
    cy.wait('@updateToolbar');
    cy.wait('@getMarkers');
    cy.contains('Marker erfolgreich erstellt und der Session hinzugefügt').should('be.visible');

    // ── Reset button clears the form ──────────────────────────────────
    selectMarkerType('Event');
    getMarkerNameInput().type('Temp');
    pressMarkerResetButton();
    getMarkerNameInput().should('have.value', '');

    // ── Toolbar shows all three markers in creation order ─────────────
    getMarkerToolbarItems().should('have.length', 3);
    // EVENT and RANGE markers render as buttons showing the abbreviation
    getMarkerToolbarItem(0).should('contain.text', 'EM');
    getMarkerToolbarItem(1).should('contain.text', 'RNG');
    // SLIDER marker renders as a slider widget, not a text button
    getMarkerToolbarItem(2).find('.marker-button-slider').should('exist');

    // ── Drag item 0 (EM) away and verify the toolbar reordered ──────────
    // The cy.intercept at the top of this test aliases every updateToolbar call.
    // The three marker-creation steps above each consumed one '@updateToolbar',
    // so the next cy.wait will match the sort-change request from the drag.
    dragMarkerToolbarItem(0, 2);

    cy.wait('@updateToolbar');
    cy.wait('@getMarkers');

    // After the sort the toolbar must still contain all three markers and
    // EM must no longer occupy the first position.
    getMarkerToolbarItems().should('have.length', 3);
    getMarkerToolbarItem(0).should('not.contain.text', 'EM');
  });

  it('Participants tab - add participant and remove with confirmation', () => {
    // `userSessions` is mutated by the stubs so each GetOneSession response reflects the latest state.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userSessions: any[] = [];

    cy.intercept('POST', '/graphql', (req) => {
      const body = req.body as { operationName?: string };
      if (body.operationName === 'GetOneSession') {
        req.alias = 'getSession';
        req.continue((res) => {
          if (res.body?.data?.session) {
            res.body.data.session.userSessions = userSessions;
          }
        });
      } else if (body.operationName === 'createUserSession') {
        req.alias = 'createParticipant';
        userSessions = [
          {
            id: 1,
            owner: { id: '99', email: 'test@example.com', displayName: null, role: 'KOALA_USER' },
            annotations: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            invitedAt: null,
            note: null,
            status: 'INITIAL',
          },
        ];
        req.reply({
          body: { data: { createUserSession: { id: 1, owner: { role: 'KOALA_USER', email: 'test@example.com' } } } },
        });
      } else if (body.operationName === 'removeUserSession') {
        req.alias = 'removeParticipant';
        userSessions = [];
        req.reply({ body: { data: { removeUserSession: { id: 1 } } } });
      }
    });

    pressCreateSessionButton();
    getCreateSessionNameField().type('Participant Test Session');
    pressDialogCreateSessionButton();
    cy.url().should('include', '/sessions/update/');
    cy.wait('@getSession');

    pressParticipantsTab();

    // Table is initially empty — no participant rows
    getParticipantTableRows().should('have.length', 0);

    // Open dialog: Create button disabled when email field is empty
    pressAddParticipantButton();
    getParticipantEmailInput().should('be.visible');
    getParticipantDialogCreateButton().should('be.disabled');

    // Cancel path: dialog closes without adding anyone
    pressParticipantDialogCancelButton();
    getParticipantEmailInput().should('not.exist');
    getParticipantTableRows().should('have.length', 0);

    // Add participant successfully
    pressAddParticipantButton();
    getParticipantEmailInput().type('test@example.com');
    getParticipantDialogCreateButton().should('not.be.disabled');
    pressParticipantDialogCreateButton();
    cy.wait('@createParticipant');
    cy.wait('@getSession');
    getParticipantTableRows().should('have.length', 1);
    getParticipantTableRows().first().should('contain.text', 'test@example.com');

    // Delete — cancel: dialog appears but participant remains
    pressParticipantDeleteButton(0);
    cy.get('.p-confirm-dialog').should('be.visible');
    cancelParticipantDeleteConfirm();
    cy.get('.p-confirm-dialog').should('not.exist');
    getParticipantTableRows().should('have.length', 1);

    // Delete — confirm: participant is removed
    pressParticipantDeleteButton(0);
    cy.get('.p-confirm-dialog').should('be.visible');
    confirmParticipantDelete();
    cy.wait('@removeParticipant');
    cy.wait('@getSession');
    getParticipantTableRows().should('have.length', 0);
  });

  it('Delete session', () => {
    pressCreateSessionButton();

    getCreateSessionNameField().type('New To Be Deleted Session');
    pressDialogCreateSessionButton();
    cy.url().should('include', '/sessions/update/');

    pressHomeButton();

    cy.contains('New To Be Deleted Session').should('exist');

    pressDeleteOneSession(0);
    cancelDeleteConfirm();

    getSessionOverviewTableRows().should((t) => expect(t.length).equal(2));

    pressDeleteOneSession(0);
    confirmDeleteSession();

    getSessionOverviewTableRows().should((t) => expect(t.length).equal(1));

    cy.contains('New To Be Deleted Session').should('not.exist');
  });
});
