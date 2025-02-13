describe('Avatar Scene Load Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    });
  
    it('should load the avatar scene', () => {
      cy.get('div').should('be.visible');
  
      cy.contains('Loading Avatar...').should('be.visible');
      
      cy.get('div').should('not.contain', 'Loading Avatar...');
    });
  
    it('should render the 3D scene correctly', () => {
      cy.get('canvas').should('exist').should('have.attr', 'width', '300').should('have.attr', 'height', '300');
    });
  });
  