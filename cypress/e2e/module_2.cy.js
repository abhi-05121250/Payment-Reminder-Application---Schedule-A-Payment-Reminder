// module_2.cy.js

describe("Payment Reminder API Tests", () => {
  Cypress.on("uncaught:exception", (err, runnable) => {
    return false;
  });
  beforeEach(() => {
    cy.visit("/");
  });
  it("should add a reminder", () => {
    // Calculate the remindAt time as current time + 5 minutes
    const remindAt = Cypress.moment().add(5, 'minutes').format('YYYY-MM-DDTHH:mm:ss');

    cy.request({
      method: "POST",
      url: sys.argv[2]+'/addReminder',
      body: {
        reminderMsg: "Test Reminder",
        remindAt: remindAt,
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("success").to.equal(true);
      
      // Assuming your response now includes a "reminder" object
      const reminder = response.body.reminder;
      expect(reminder).to.have.property("id").to.be.a("number");
      expect(reminder).to.have.property("reminderMsg").to.equal("Test Reminder");
      expect(reminder).to.have.property("remindAt").to.be.a("string"); // You can modify this based on the actual type
      expect(reminder).to.have.property("isReminded").to.equal(false);
    });
  });

  it("should get all reminders", () => {
    cy.request({
      method: "GET",
      url: sys.argv[2]+'/getAllReminder',
    }).then((res) => {
      expect(res.status).to.equal(200);

    // Replace property names based on the actual structure of your response
    if (res.body.length > 0) {
      const firstReminder = res.body[0];
      expect(firstReminder).to.have.property("reminderMsg");
      expect(firstReminder).to.have.property("remindAt");
      expect(firstReminder).to.have.property("isReminded");
      expect(firstReminder).to.have.property("id"); // Adjust property name based on the actual structure
    }
  });
  });
});
