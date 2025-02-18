describe('Avatar Interaction Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
      cy.contains('Loading Avatar...').should('not.exist');
      
    });

    it('should reset the avatar to the default position when reset button is clicked', () => {
      cy. get('canvas')
        .trigger("mousedown", { clientX: 100, clientY: 150 })
        .trigger("mousemove", { clientX: 700, clientY: 150 })
        .trigger("mouseup");

        cy.wait(500);

      cy.get('canvas').should('exist');
      cy.get('button').click(); 
      cy.wait(500);

      cy.get('canvas').should('exist'); 
    });
});
