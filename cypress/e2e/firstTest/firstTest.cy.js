describe('example home page app', () => {
    it('Should see website', () => {
       cy.visit('/')
      })

        it('should pass if canvas appears on the page', () => {
          // Visit the page you want to test (replace with your actual URL)
          cy.visit('/');
      
          // Check if the canvas element exists on the page
          cy.get('canvas')
            .should('exist');  // This will pass if the canvas is found, fail otherwise
        });
      });
      