describe('Clickable Zone Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    });
  
    it('should display a clickable zone once the avatar has loaded', () => {
      cy.contains('Loading Avatar...').should('not.exist');
  
      cy.get('canvas').then(($canvas) => {
        cy.wrap($canvas).click(150, 150); 
      });
    });
  });
  