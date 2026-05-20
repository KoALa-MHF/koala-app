// --- Tab navigation ---
export const pressParticipantsTab = () => cy.contains('.p-tabview-nav a', 'Mitglieder').click();

// --- Participants table ---
export const getParticipantTableRows = () => cy.get('[data-cy="participant-table-row"]');

// --- Add participant dialog ---
export const pressAddParticipantButton = () => cy.get('[data-cy="participant-add-btn"]').click();

export const getParticipantEmailInput = () => cy.get('#session-participants-dialog-email-address');

export const getParticipantDialogCreateButton = () => cy.get('[data-cy="participant-dialog-create-btn"]');
export const pressParticipantDialogCreateButton = () => getParticipantDialogCreateButton().click();

export const pressParticipantDialogCancelButton = () => cy.get('[data-cy="participant-dialog-cancel-btn"]').click();

// --- Delete participant confirmation ---
export const pressParticipantDeleteButton = (index: number) =>
  cy.get('[data-cy="participant-delete-btn"]').eq(index).click();

export const confirmParticipantDelete = () => cy.get('.p-confirm-dialog-accept').click();
export const cancelParticipantDeleteConfirm = () => cy.get('.p-confirm-dialog-reject').click();
