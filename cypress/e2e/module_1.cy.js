describe("Payment Reminder HTML and CSS Test", () => {
  Cypress.on("uncaught:exception", (err, runnable) => {
    return false;
  });

  it("passes", () => {
    cy.visit("/");
 // Check the existence of essential elements
    cy.get(".App").should("exist");
    cy.get(".homepage_header").should("exist");
    cy.get("h1:contains('Payment Reminder')").should("exist");
    cy.get("#reminderMsg").should("exist");
    cy.get("#remindAt").should("exist");
    cy.get("button:contains('Add Reminder')").should("exist");
    cy.get(".homepage_body").should("exist");
    cy.get("h2:contains('Reminder List')").should("exist");

    // Check CSS styling
    cy.get(".App").should("have.css", "font-family", "Arial, sans-serif");
    cy.get(".homepage").should("have.css", "background");
    cy.get(".homepage").should("have.css", "min-width");
    cy.get(".homepage_header").should("have.css", "background-color", "white");
    cy.get(".homepage_header").should("have.css", "border-radius", "8px");
    cy.get(".homepage_header h1").should("have.css", "font-size", "18px");
    cy.get(".homepage_header .button").should("have.css", "background-color", "rgb(24, 119, 242)");

    // Add more checks based on your specific styling and UI components
    // Add more checks based on your specific styling and UI components
  });
});
