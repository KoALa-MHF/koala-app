import {
  getSessionNameField,
  pressSaveButton,
} from '../support/session-manage.po';
import {
  pressCreateSessionButton,
  getSessionOverviewTableRows,
  pressAllDeleteSessionButtons,
  pressEditOnSession,
  pressDeleteOnSession,
} from '../support/session-overview.po';

describe('koala-frontend', () => {
  beforeEach(() => {
    cy.intercept('/api').as('api');

    cy.visit('/');

    cy.wait(['@api']);

    pressAllDeleteSessionButtons();
  });

  it('Create of a session with session name', () => {
    // Custom command example, see `../support/commands.ts` file
    //cy.login('my-email@something.com', 'myPassword');

    // Function helper example, see `../support/app.po.ts` file
    getSessionOverviewTableRows().should((t) => expect(t.length).equal(1));
    pressCreateSessionButton();

    getSessionNameField().type('New Session');
    pressSaveButton();

    getSessionOverviewTableRows().should((t) => expect(t.length).equal(2));
  });

  it('Update session', () => {
    pressCreateSessionButton();

    getSessionNameField().type('New Session');
    pressSaveButton();

    pressEditOnSession(0);

    getSessionNameField().type('New Session - Update');
    pressSaveButton();

    cy.contains('New Session - Update');
  });

  it('Delete session', () => {
    pressCreateSessionButton();

    getSessionNameField().type('New Session');
    pressSaveButton();

    pressDeleteOnSession(0);

    getSessionOverviewTableRows().should((t) => expect(t.length).equal(1));

    cy.contains('New Session').should('not.exist');
  });
});
