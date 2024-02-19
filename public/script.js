document.addEventListener("DOMContentLoaded", function () {
  loadReminders();
});

function addReminder() {
  const reminderMsg = document.getElementById("reminderMsg").value;
  const remindAtInput = document.getElementById("remindAt");
  const remindAt = remindAtInput.value.replace("T", " ");
  const selectedDate = new Date(remindAt);

  const currentDate = new Date();
  
  if (reminderMsg && selectedDate > currentDate) {
    const data = {
      reminderMsg,
      remindAt,
    };
    //fetch("https://" + process.env.PORT + ".sock.hicounselor.com/addReminder", {

    fetch("http://localhost:8080/addReminder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        console.log("Response:", result);
        loadReminders(); // Refresh the list after adding a reminder
      })
      .catch(error => {
        console.error("Error:", error);
      });
  } else if (!reminderMsg) {
    alert("Please enter a reminder message.");
  } else if (!remindAt) {
    alert("Please enter a reminder date.");
  } 
  else {
    alert("Please choose a future date and time.");
  }

  ;
}


function loadReminders() {
  fetch("http://localhost:8080/getAllReminder")
    .then(response => response.json())
    .then(data => {
      const reminderList = document.getElementById("reminderList");
      reminderList.innerHTML = "<h2>Reminder List</h2>";

      data.forEach(reminder => {
        const p = document.createElement("p");
        p.textContent = `${reminder.reminderMsg} - ${new Date(reminder.remindAt).toLocaleString()}`;
        reminderList.appendChild(p);
      });
    })
    .catch(error => console.error("Error:", error));
}


