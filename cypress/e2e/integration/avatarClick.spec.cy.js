describe('Avatar Click Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    });
  
    it('should trigger alert on clicking the clickable zone after the avatar is loaded', () => {
      cy.contains('Loading Avatar...').should('not.exist');
  
      cy.get('canvas').click(150, 150); 
  
      cy.on('window:alert', (alertText) => {
        expect(alertText).to.equal('Helmet clicked! Displaying info/video...');
      });
    });
  });
  