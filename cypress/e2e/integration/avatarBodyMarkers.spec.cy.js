describe('Avatar Markers Visibility', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000'); 
  });

  it('should hide body markers when rotating avatar or interacting with the avatar', () => {
    cy.get('#marker-head').should('be.visible');
    cy.get('#marker-chest').should('be.visible');
    cy.get('#marker-left-arm').should('be.visible');
    cy.get('#marker-right-arm').should('be.visible');
    cy.get('#marker-left-leg').should('be.visible');
    cy.get('#marker-right-leg').should('be.visible');
    
    // Trigger rotation 
    cy.get(`[data-testid="avatar-container"]`) 
    .trigger('click', { clientX: 0, clientY: 300})

    cy.get('#marker-head').should('not.be.visible');
    cy.get('#marker-chest').should('not.be.visible');
    cy.get('#marker-left-arm').should('not.be.visible');
    cy.get('#marker-right-arm').should('not.be.visible');
    cy.get('#marker-left-leg').should('not.be.visible');
    cy.get('#marker-right-leg').should('not.be.visible');
  });

  it('should show body markers when reset button is clicked', () => {
    cy.get(`[data-testid="avatar-container"]`) 
      .trigger('click', {clientX: 50, clientY: 100 , force: true });
    
    cy.get('div').contains('Head').should('be.visible');
    
    cy.get('button').contains('Learn More!').click();
    
    cy.get('#marker-head').should('be.visible');
    cy.get('#marker-chest').should('be.visible');
    cy.get('#marker-left-arm').should('be.visible');
    cy.get('#marker-right-arm').should('be.visible');
    cy.get('#marker-left-leg').should('be.visible');
    cy.get('#marker-right-leg').should('be.visible');
  });
});
