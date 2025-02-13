describe("Avatar Rotation - Mobile", () => {
  beforeEach(() => {
    cy.viewport("iphone-x"); 
    cy.visit("http://localhost:3000");
  });

  it("should rotate the avatar using touch drag", () => {
    cy.get("canvas")
      .trigger("touchstart", { touches: [{ clientX: 50, clientY: 200 }] }) 
      .trigger("touchmove", { touches: [{ clientX: 450, clientY: 200 }] }) 
      .trigger("touchend");

    cy.wait(500);

    cy.get("canvas")
      .trigger("touchstart", { touches: [{ clientX: 450, clientY: 200 }] }) 
      .trigger("touchmove", { touches: [{ clientX: 50, clientY: 200 }] }) 
      .trigger("touchend");

    cy.wait(500);
  });
});
