export const getSessionOverviewTable = () => cy.get('#session-overview');
export const getSessionOverviewTableRows = () => cy.get('tr');
export const pressCreateSessionButton = () => cy.get('#session-create-btn').click();