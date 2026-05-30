export const getSessionNameField = () => cy.get('[data-cy="session-maintain-name-input"]');
export const getSessionDescriptionField = () => cy.get('[data-cy="session-maintain-description-input"]');
export const getEditableCheckbox = () => cy.get('[data-cy="session-maintain-editable-check"]').find('.p-checkbox');
export const getPlayerCheckbox = () => cy.get('[data-cy="session-maintain-player-check"]').find('.p-checkbox');
export const getSampleSolutionCheckbox = () =>
  cy.get('[data-cy="session-maintain-sample-solution-check"]').find('.p-checkbox');
export const getAnalysisCheckbox = () => cy.get('[data-cy="session-maintain-analysis-check"]').find('.p-checkbox');
export const getLiveSessionCheckbox = () =>
  cy.get('[data-cy="session-maintain-live-session-check"]').find('.p-checkbox');

export const getOnlineCheckbox = () => cy.get('[data-cy="session-maintain-online-check"]').find('.p-checkbox');
export const getStartDateInput = () => cy.get('[data-cy="session-maintain-start-date-input"]');
export const getEndDateInput = () => cy.get('[data-cy="session-maintain-end-date-input"]');

export const getGeneralDataSaveButton = () => cy.get('[data-cy="session-data-save-btn"]');
export const pressGeneralDataSaveButton = () => getGeneralDataSaveButton().click();

export const getAudioVideoTab = () => cy.get('[data-cy="session-maintain-audio-tab"]');
export const pressAudioTab = () => cy.contains('.p-tabview-nav a', 'Audio / Video').click();

export const getMediaDeleteButton = () => cy.get('[data-cy="session-media-delete-btn"]');
export const pressMediaDeleteButton = () => getMediaDeleteButton().click();
export const confirmMediaDelete = () => cy.get('.p-confirm-dialog-accept').click();
export const cancelMediaDeleteConfirm = () => cy.get('.p-confirm-dialog-reject').click();
