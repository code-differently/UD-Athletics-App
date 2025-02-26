describe("Avatar Click Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000"); // Update port if necessary
  });

  const bodyParts = [
    "Head",
    "Chest",
    "Left Arm",
    "Right Arm",
    "Left Leg",
    "Right Leg",
  ];

  bodyParts.forEach((part) => {
    it(`should click on the ${part} marker and show an alert`, () => {
      cy.on("window:alert", (text) => {
        expect(text).to.equal(`You clicked on ${part}`);
      });

      cy.contains(part).click({ force: true });
    });
  });
});
