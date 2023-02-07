import { pressHomeButton } from '../support/header.po';
import {
  getGeneralDataSaveButton,
  getSessionDescriptionField,
  getSessionNameField,
  pressGeneralDataSaveButton,
  getEditableCheckbox,
  getPlayerCheckbox,
  getSampleSolutionCheckbox,
  getAnalysisCheckbox,
  getOnlineCheckbox,
  getStartDateInput,
  getEndDateInput,
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
    cy.intercept('/graphql').as('api');

    cy.visit('/');

    cy.wait([
      '@api',
    ]);

    pressAllDeleteSessionButtons();
  });

  it('Create/update session with basic session data', () => {
    getSessionOverviewTableRows().should((t) => expect(t.length).equal(1));
    pressCreateSessionButton();

    getDialogCreateSessionButton().should('be.disabled');

    getCreateSessionNameField().type('New Session');
    pressDialogCreateSessionButton();

    getGeneralDataSaveButton().should('be.disabled');

    getSessionNameField().clear();

    getGeneralDataSaveButton().should('be.disabled');
    getSessionNameField().type('Updated Session');
    getGeneralDataSaveButton().should('be.enabled');

    getSessionDescriptionField().type('Session Description');

    getEditableCheckbox().click();
    getPlayerCheckbox().click();
    getSampleSolutionCheckbox().click();
    getAnalysisCheckbox().click();

    //check online and dates behaviour
    getOnlineCheckbox().click();
    getStartDateInput().should('not.exist');
    getEndDateInput().should('not.exist');

    getOnlineCheckbox().click();
    getStartDateInput().should('exist');
    getEndDateInput().should('exist');

    getStartDateInput().click().find('table').find('tr').eq(3).click();
    //online checkbox should be disabled
    getOnlineCheckbox().should('have.class', 'p-checkbox-disabled');
    getEndDateInput().click().find('table').find('tr').eq(1).click();

    getGeneralDataSaveButton().should('be.disabled');

    getStartDateInput().click().find('table').find('tr').eq(1).click();
    getEndDateInput().click().find('table').find('tr').eq(3).click();
    getGeneralDataSaveButton().should('be.enabled');

    pressGeneralDataSaveButton();

    pressHomeButton();

    getSessionOverviewTableRows().should((t) => expect(t.length).equal(2));

    getSessionOverviewTableRow(1).find('[data-cy="session-overview-name-col"]').should('have.text', 'Updated Session');
    getSessionOverviewTableRow(1).find('[data-cy="session-overview-created-at-col"]').should('not.be.empty');
    getSessionOverviewTableRow(1).find('[data-cy="session-overview-changed-at-col"]').should('not.be.empty');

    //check if all data was stored correctly
    pressEditOnSession(0);

    getSessionNameField().should('have.value', 'Updated Session');
    getSessionDescriptionField().should('have.value', 'Session Description');
    getEditableCheckbox().should('have.class', 'p-checkbox-checked');
    getPlayerCheckbox().should('have.class', 'p-checkbox-checked');
    getSampleSolutionCheckbox().should('have.class', 'p-checkbox-checked');
    getAnalysisCheckbox().should('have.class', 'p-checkbox-checked');

    getStartDateInput().should('not.be.empty');
    getEndDateInput().should('not.be.empty');

    //update session
    getSessionNameField().clear().type('Second Updated Session');
    getSessionDescriptionField().clear().type('Updated Description');
    //deselect checkboxes
    getEditableCheckbox().click();
    getPlayerCheckbox().click();
    getSampleSolutionCheckbox().click();
    getAnalysisCheckbox().click();

    pressGeneralDataSaveButton();
    pressHomeButton();

    getSessionOverviewTableRows().should((t) => expect(t.length).equal(2));

    getSessionOverviewTableRow(1)
      .find('[data-cy="session-overview-name-col"]')
      .should('have.text', 'Second Updated Session');
    getSessionOverviewTableRow(1).find('[data-cy="session-overview-created-at-col"]').should('not.be.empty');
    getSessionOverviewTableRow(1).find('[data-cy="session-overview-changed-at-col"]').should('not.be.empty');

    //check if all data was stored correctly
    pressEditOnSession(0);

    getSessionNameField().should('have.value', 'Second Updated Session');
    getSessionDescriptionField().should('have.value', 'Updated Description');
    getEditableCheckbox().should('not.have.class', 'p-checkbox-checked');
    getPlayerCheckbox().should('not.have.class', 'p-checkbox-checked');
    getSampleSolutionCheckbox().should('not.have.class', 'p-checkbox-checked');
    getAnalysisCheckbox().should('not.have.class', 'p-checkbox-checked');

    getStartDateInput().should('not.be.empty');
    getEndDateInput().should('not.be.empty');
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
