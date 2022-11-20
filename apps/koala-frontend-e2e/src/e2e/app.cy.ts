import {
  getSessionNameField,
  pressSaveButton,
} from '../support/session-manage.po';
import {
  pressCreateSessionButton,
  getSessionOverviewTableRows,
  pressAllDeleteSessionButtons,
} from '../support/session-overview.po';

describe('koala-frontend', () => {
  beforeEach(() => {
    cy.visit('/');

    let counter = 0;
    getSessionOverviewTableRows().each((button) => {
      counter++;
      console.log(button);
    });

    if (counter > 1) {
      cy.get('button[name="deleteButton"]', {}).each((button) => {
        cy.wrap(button).click();
      });
    }
  });

  it('Create of a session', () => {
    // Custom command example, see `../support/commands.ts` file
    //cy.login('my-email@something.com', 'myPassword');

    // Function helper example, see `../support/app.po.ts` file
    getSessionOverviewTableRows().should((t) => expect(t.length).equal(1));
    pressCreateSessionButton();

    getSessionNameField().type('New Session');
    pressSaveButton();

    getSessionOverviewTableRows().should((t) => expect(t.length).equal(2));

    pressAllDeleteSessionButtons();
  });
});
