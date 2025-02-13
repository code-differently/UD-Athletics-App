describe('3D Athlete Model Tests', () => {
  beforeEach(() => { 
      cy.visit('/athlete-model'); // Navigate to the page with the 3D model
  });

  it('Should display the 3D rendered football athlete', () => {
      cy.get('[data-cy=3d-athlete]')
        .should('be.visible'); // Ensures the model is visible
  });

  it('Should have the correct UD-approved uniform and colors', () => {
      cy.get('[data-cy=3d-athlete]')
        .should('have.attr', 'data-uniform', 'UD-approved'); // Assuming a data attribute exists
      cy.get('[data-cy=3d-athlete]')
        .should('have.css', 'color') // Check for UD primary color
        .and('include', 'blue'); 
  });

  it('Should support interaction with defined body parts', () => {
      const bodyParts = ['mouth', 'neck', 'chest', 'torso', 'hands', 'feet', 'knee', 'ankle', 'wrist', 'shoulder', 'elbow'];
            
      bodyParts.forEach(part => { 
          cy.get(`[data-cy=${part}]`) // Corrected string interpolation with backticks
            .should('be.visible')
            .click(); // Ensures body parts are interactable
      });
  });
});
