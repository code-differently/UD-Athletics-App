describe('Help Affordance Tests', () => {
  beforeEach(() => { 
      cy.visit('http://localhost:3000'); // Navigate to the avatar model page
  });

  it('Should display help affordance on first load', () => {
      cy.get('[data-cy=help-affordance]')
        .should('be.visible') // Ensure the affordance is visible when first loading
        .contains('Interact with the avatar to learn more'); // Check for expected instructional text
  });

  it('Should allow the user to hide the affordance', () => {
      cy.get('[data-cy=help-close-btn]').click(); // Clicks the close button
      cy.get('[data-cy=help-affordance]').should('not.exist'); // Ensures it disappears
  });

  it('Should allow the user to reopen affordance using the "?" icon', () => {
      cy.get('[data-cy=help-close-btn]').click(); // Close the affordance first
      cy.get('[data-cy=help-icon]').click(); // Click the '?' help icon
      cy.get('[data-cy=help-affordance]').should('be.visible'); // Ensure the affordance reappears
  });

  it('Should display instructional text when clicking the help button', () => {
      cy.get('[data-cy=help-icon]').click(); // Click the '?' help icon
      cy.get('[data-cy=help-affordance]').should('contain.text', 'Interact with the avatar to learn more');
  });

  it('Should auto-hide the affordance after a delay (if applicable)', () => {
      cy.wait(5000); // Adjust this based on the expected timeout duration
      cy.get('[data-cy=help-affordance]').should('not.exist'); // Ensure it disappears after timeout
  });
});
