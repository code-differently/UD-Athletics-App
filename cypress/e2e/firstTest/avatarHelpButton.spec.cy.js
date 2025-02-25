describe("Help Affordance Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000"); // Navigate to the avatar model page
  });

  it("Should auto-hide the affordance after a delay (if applicable)", () => {
    cy.wait(5000); // Adjust this based on the expected timeout duration
    cy.get("[data-cy=help-affordance]").should("not.exist"); // Ensure it disappears after timeout
  });
});
