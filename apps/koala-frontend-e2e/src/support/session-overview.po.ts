export const getSessionOverviewTable = () => cy.get('#session-overview');
export const getSessionOverviewTableRows = () => cy.get('tr');
export const pressCreateSessionButton = () =>
  cy.get('#session-create-btn').click();

export const pressAllDeleteSessionButtons = () => {
  getSessionOverviewTableRows().then((rows) => {
    if (rows.length > 1) {
      cy.get('button[name="deleteButton"]', {}).each((button) => {
        cy.wrap(button).click();
      });
    }
  });
};

export const pressDeleteOnSession = (row:number) => {
    let counter = 0;
    cy.get('button[name="deleteButton"]', {}).each((button) => {
      if (counter === row) {
        cy.wrap(button).click();
      }
      counter++;
    });
};

export const pressEditOnSession = (row: number) => {
  let counter = 0;
  cy.get('button[name="settingsButton"]', {}).each((button) => {
    if (counter === row) {
      cy.wrap(button).click();
    }
    counter++;
  });
};
