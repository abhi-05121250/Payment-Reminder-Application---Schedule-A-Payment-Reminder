const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

dotenv.config();

const app = express();
const PORT = process.env.PORT||8080;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});




db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
    createTable();
    setupEmailReminderJob();
  }
});

function createTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS reminders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      reminderMsg VARCHAR(255) NOT NULL,
      remindAt DATETIME NOT NULL,
      isReminded BOOLEAN DEFAULT false
    )
  `;

  db.query(query, (err) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table created or already exists");
    }
  });
}

app.post("/addReminder", (req, res) => {
  const { reminderMsg, remindAt } = req.body;

  const query = `
    INSERT INTO reminders (reminderMsg, remindAt, isReminded)
    VALUES (?, ?, ?)
  `;

  db.query(query, [reminderMsg, new Date(remindAt), false], (err, result) => {
    if (err) {
      console.error("Error adding reminder:", err);
      res.status(500).send({ error: "Error adding reminder" });
    } else {
      const insertedId = result.insertId; // Assuming your table has an auto-incrementing primary key

      console.log("Reminder added successfully");

      // Send back only the specified fields in the response
      res.send({
        success: true,
        reminder: {
          id: insertedId,
          reminderMsg: reminderMsg,
          remindAt: new Date(remindAt),
          isReminded: false
        }
      });
    }
  });
});



app.get("/getAllReminder", (req, res) => {
  const query = "SELECT * FROM reminders";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching reminders:", err);
      res.status(500).send({ error: "Error fetching reminders" });
    } else {
      res.json(results);
    }
  });
});


function setupEmailReminderJob() {
  cron.schedule("* * * * *", () => {
    sendReminders();
  });
}

function sendReminders() {
  const query = "SELECT * FROM reminders WHERE isReminded = false AND remindAt <= NOW()";

  db.query(query, (err, reminders) => {
    if (err) {
      console.error("Error fetching reminders for sending:", err);
    } else {
      reminders.forEach((reminder) => {
        sendEmailReminder(reminder);
      });
    }
  });
}

function sendEmailReminder(reminder) {
  const mailOptions = {
    from: "hicounselor@gmail.com",
    to: "abhilashakumari7260@gmail.com",
    subject: "Node Mailer",
    text: `Payment reminder: ${reminder.reminderMsg} - Due at ${new Date(reminder.remindAt).toLocaleString()}`,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
      markReminderAsSent(reminder.id);
    }
  });
}

function markReminderAsSent(reminderId) {
  const updateQuery = "UPDATE reminders SET isReminded = true WHERE id = ?";
  db.query(updateQuery, [reminderId], (err) => {
    if (err) {
      console.error("Error updating reminder:", err);
    } else {
      console.log("Reminder marked as sent");
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});