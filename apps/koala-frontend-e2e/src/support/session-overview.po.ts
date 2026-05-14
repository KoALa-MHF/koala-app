export const getCreateSessionNameField = () => cy.get('[data-cy="create-session-name-input"');
export const pressCreateSessionButton = () => getCreateSessionButton().click();
export const getCreateSessionButton = () => cy.get('[data-cy="session-create-btn"]');
export const pressDialogCreateSessionButton = () => getDialogCreateSessionButton().click();
export const getDialogCreateSessionButton = () => cy.get('[data-cy="session-create-dialog-create-btn"]');

//table operations
// Scope to the first table only (the "own sessions" accordion tab) to avoid
// counting header rows from the other two collapsed accordion tab tables.
export const getSessionOverviewTableRows = () => cy.get('[data-cy="session-overview-table"]').first().find('tr');
export const getSessionOverviewTableRow = (row: number) => getSessionOverviewTableRows().eq(row);

export const pressAllDeleteSessionButtons = () => {
  getSessionOverviewTableRows().then((rows) => {
    if (rows.length > 1) {
      cy.get('p-tableHeaderCheckbox').find('.p-checkbox-box').first().click();
      cy.get('[data-cy="session-overview-delete-btn"]').click();
      confirmDeleteSession();
      // Wait for all delete + reload requests to finish and the table to reach empty state.
      getSessionOverviewTableRows().should((r) => expect(r.length).equal(1));
    }
  });
};

export const pressDeleteOneSession = (row: number) => {
  // Only click the checkbox if nothing is currently selected (button disabled).
  // This avoids accidentally deselecting a row that was left selected after a cancelled delete.
  cy.get('[data-cy="session-overview-delete-btn"]').then(($btn) => {
    if ($btn.prop('disabled')) {
      cy.get('p-tableCheckbox').eq(row).find('.p-checkbox-box').click();
    }
  });
  cy.get('[data-cy="session-overview-delete-btn"]').click();
};

export const confirmDeleteSession = () => {
  cy.get('.p-confirm-dialog-accept').click();
};

export const cancelDeleteConfirm = () => {
  cy.get('.p-confirm-dialog-reject').click();
};

export const pressEditOnSession = (row: number) => {
  let counter = 0;
  cy.get('[data-cy="session-overview-settings-btn"]', {}).each((button) => {
    if (counter === row) {
      cy.wrap(button).click();
    }
    counter++;
  });
};
