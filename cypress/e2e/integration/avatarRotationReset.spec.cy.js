describe('Avatar Interaction Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    });

    it('should reset the avatar to the default position when reset button is clicked', () => {
      cy.contains('Loading Avatar...').should('not.exist');

      cy.get('#reset-button').click(); // Assuming there's a reset button with this ID

      cy.get('canvas').should('exist'); // Again, update with a check for default position
    });
});
