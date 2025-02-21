describe('Avatar Loading', () => {
  it('should display the loader while the avatar is loading', () => {
    cy.visit('http://localhost:3000'); 

    
    cy.get('#loader').should('be.visible'); 

    cy.wait(2000); 
    
    cy.get('#loader').should('not.exist');
  });
});
