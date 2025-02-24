describe('Avatar Markers Visibility', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000'); 
  });

  it('should hide body markers when rotating avatar or interacting with the avatar', () => {
    cy.get('div').contains('Head').should('be.visible');
    cy.get('div').contains('Chest').should('be.visible');
    cy.get('div').contains('Left Arm').should('be.visible');
    cy.get('div').contains('Right Arm').should('be.visible');
    
    // Trigger rotation - let's assume your AvatarScene triggers rotation when clicked.
    cy.get("[data-testid='avatar-container']") 
      .trigger('click'); 

    cy.get('div').contains('Head').should('not.be.visible');
    cy.get('div').contains('Chest').should('not.be.visible');
    cy.get('div').contains('Left Arm').should('not.be.visible');
    cy.get('div').contains('Right Arm').should('not.be.visible');
  });

  it('should show body markers when reset button is clicked', () => {
    cy.get("[data-testid='avatar-container']") 
      .trigger('click');
    
    cy.get('div').contains('Head').should('not.be.visible');
    
    cy.get('button').contains('Learn More!').click();
    
    // Markers should be visible again after reset
    cy.get('div').contains('Head').should('be.visible');
    cy.get('div').contains('Chest').should('be.visible');
    cy.get('div').contains('Left Arm').should('be.visible');
    cy.get('div').contains('Right Arm').should('be.visible');
  });
});
