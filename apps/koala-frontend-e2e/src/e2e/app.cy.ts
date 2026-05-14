import { pressHomeButton } from '../support/header.po';
import {
  getSessionDescriptionField,
  getSessionNameField,
  getEditableCheckbox,
  getPlayerCheckbox,
  getSampleSolutionCheckbox,
  getAnalysisCheckbox,
  getLiveSessionCheckbox,
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
