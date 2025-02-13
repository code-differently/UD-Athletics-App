describe('Avatar Rotation - Desktop', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000'); 
  });

  it('should rotate the avatar on mouse click and touch gesture', () => {
    cy.get('canvas')
    .trigger("mousedown", { clientX: 100, clientY: 150 })
      .trigger("mousemove", { clientX: 400, clientY: 150 }) // Move right
      .trigger("mouseup");

   cy.wait(2000);

   cy.get("canvas")
   .trigger("mousedown", { clientX: 400, clientY: 150 })
   .trigger("mousemove", { clientX: 100, clientY: 150 }) // Move left
   .trigger("mouseup");

  cy.wait(500);
  });
});



  