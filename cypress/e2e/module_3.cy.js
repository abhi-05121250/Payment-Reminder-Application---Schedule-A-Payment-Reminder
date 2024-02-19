describe("Reminder App Tests", () => {
    Cypress.on("uncaught:exception", (err, runnable) => {
        return false;
      });
  
    it("passes", () => {
      cy.visit("/");
      cy.get("#remindAt").type("2022-01-01T00:00");
      cy.get(".button").click();
      cy.on("window:alert", (alertText) => {
        expect(alertText).to.equal("Please enter a reminder message.");
      });
      cy.wait(200); 
      // Check that no reminder is added to the list
      cy.get("#reminderList").should("not.contain", "Cypress Test 1");
      
      cy.reload(); // Refresh the page

      cy.get("#reminderMsg").type("Cypress Test 1");
      cy.get(".button").click();
      cy.on("window:alert", (alertText) => {
        expect(alertText).to.equal("Please enter a reminder date.");
      });
      cy.wait(200); 
      // Check that no reminder is added to the list
      cy.get("#reminderList").should("not.contain", "Cypress Test 1");

      cy.reload(); // Refresh the page

      cy.get("#reminderMsg").type("Cypress Test 1");
      cy.get("#remindAt").type("2022-01-01T00:00");
      cy.get(".button").click();
      cy.on("window:alert", (alertText) => {
        expect(alertText).to.equal("Please choose a future date and time.");
      });
      cy.wait(200); 
      // Check that no reminder is added to the list
      cy.get("#reminderList").should("not.contain", "Cypress Test 1");

      cy.reload(); // Refresh the page

      cy.get("#reminderMsg").type("Cypress Test 2");
      const currentDate = new Date();
      const futureDate = new Date(currentDate.getTime() + 5 * 60000); // 5 minutes later
      const formattedDate = futureDate.toISOString().slice(0, 16);
      cy.get("#remindAt").type(formattedDate);
      cy.get(".button").click();
      // Check that the reminder is added to the list
      cy.wait(200); 
      cy.get("#reminderList").should("contain", "Cypress Test 2");
    });

  });
  