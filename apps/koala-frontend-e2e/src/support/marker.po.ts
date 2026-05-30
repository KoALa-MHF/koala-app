// --- Tab navigation ---
export const pressMarkerTab = () => cy.contains('.p-tabview-nav a', 'Marker').click();

// --- Marker form fields ---
export const getMarkerTypeDropdown = () => cy.get('[data-cy="marker-type-dropdown"]');
export const selectMarkerType = (label: 'Event' | 'Range' | 'Slider') => {
  getMarkerTypeDropdown().click();
  cy.get('.p-dropdown-panel').should('be.visible');
  cy.get('.p-dropdown-panel .p-dropdown-item').contains(label).click();
};

export const getMarkerNameInput = () => cy.get('#marker-name-input');
export const getMarkerDescriptionInput = () => cy.get('#marker-description-textarea');
export const getMarkerAbbreviationInput = () => cy.get('#marker-abbreviation-input');

export const getMarkerValueRangeFromInput = () => cy.get('[data-cy="marker-value-range-from"] input');
export const getMarkerValueRangeToInput = () => cy.get('[data-cy="marker-value-range-to"] input');

export const getMarkerColorTextInput = () => cy.get('[data-cy="marker-color-text-input"]');
export const getMarkerContentColorSwitch = () => cy.get('[data-cy="marker-content-color-switch"]');

export const getMarkerIconDropdown = () => cy.get('[data-cy="marker-icon-dropdown"]');
export const selectFirstMarkerIcon = () => {
  getMarkerIconDropdown().click();
  cy.get('.p-dropdown-panel').should('be.visible');
  cy.get('.p-dropdown-panel .p-dropdown-item').first().click();
};

// --- Add / Reset buttons ---
export const getMarkerAddButton = () => cy.get('[data-cy="marker-add-btn"]');
export const pressMarkerAddButton = () => getMarkerAddButton().click();
export const getMarkerResetButton = () => cy.get('[data-cy="marker-reset-btn"]');
export const pressMarkerResetButton = () => getMarkerResetButton().click();

// --- Toolbar (right-side placement area) ---
export const getMarkerToolbar = () => cy.get('[data-cy="marker-toolbar"]');
export const getMarkerToolbarItems = () => cy.get('[data-cy="marker-toolbar-item"]');
export const getMarkerToolbarItem = (index: number) => getMarkerToolbarItems().eq(index);

/**
 * Reorders the marker toolbar by directly invoking the component's `dropped()`
 * handler via Angular's DevTools API.
 *
 * Native CDK drag-drop event simulation (MouseEvent / PointerEvent chains) is
 * unreliable in Cypress because CDK registers listeners on `document` inside
 * synchronous callbacks that Cypress cannot intercept cleanly. Invoking the
 * component method directly skips the CDK plumbing while still exercising the
 * full sort → sortChange emission → updateToolbarMarker HTTP call chain.
 *
 * Requires the Angular app to run in development mode so that
 * `window.ng.getComponent()` is available.
 */
export const dragMarkerToolbarItem = (fromIndex: number, toIndex: number) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cy.window().then((win: any) => {
    const toolbarEl = win.document.querySelector('koala-marker-toolbar');
    const component = win.ng?.getComponent(toolbarEl);
    if (!component) {
      throw new Error('Angular DevTools API unavailable — ensure the app runs in development mode.');
    }
    component.dropped({ previousIndex: fromIndex, currentIndex: toIndex });
    win.ng.applyChanges(component);
  });
};
