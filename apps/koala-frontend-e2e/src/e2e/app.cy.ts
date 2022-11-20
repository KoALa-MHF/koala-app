import { getSessionNameField, pressSaveButton } from '../support/session-manage.po';
import { pressCreateSessionButton, getSessionOverviewTableRows } from '../support/session-overview.po';

describe('koala-frontend', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    // Custom command example, see `../support/commands.ts` file
    //cy.login('my-email@something.com', 'myPassword');

    // Function helper example, see `../support/app.po.ts` file
    getSessionOverviewTableRows().should((t) => expect(t.length).equal(1));
    pressCreateSessionButton().click();

    getSessionNameField().type('New Session');
    pressSaveButton();

    getSessionOverviewTableRows().should((t) => expect(t.length).equal(2));
  });
});
