document.addEventListener("DOMContentLoaded", function () {
    const sendEmailsButton = document.getElementById("sendEmails");

    if (sendEmailsButton) {
        sendEmailsButton.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();

            console.log("📩 Send Emails button clicked!");

            const csvFileInput = document.getElementById("csvFile");
            const csvFile = csvFileInput?.files[0];
            const senderEmail = document.getElementById("senderEmail")?.value.trim();
            const senderPassword = document.getElementById("senderPassword")?.value.trim();
            const subject = document.getElementById("subject")?.value.trim();
            const emailBody = document.getElementById("emailBody")?.value.trim();
            const attachmentInput = document.getElementById("attachments");
            const attachments = attachmentInput?.files;

            const statusBox = document.getElementById("statusBox");
            const statusList = document.getElementById("statusList");

            if (!statusBox || !statusList) {
                console.error("❌ Status box elements not found.");
                return;
            }

            // Clear previous messages
            statusList.innerHTML = "";
            statusBox.style.display = "none";

            // ✅ Validation check
            if (!csvFile || !senderEmail || !senderPassword || !subject) {
                let errorMsg = document.createElement("li");
                errorMsg.textContent = "❌ Please fill in all required fields.";
                errorMsg.style.color = "red";
                statusList.appendChild(errorMsg);
                statusBox.style.display = "block";
                return;
            }

            const formData = new FormData();
            formData.append("csvFile", csvFile);
            formData.append("senderEmail", senderEmail);
            formData.append("senderPassword", senderPassword);
            formData.append("subject", subject);
            formData.append("emailBody", emailBody);

            for (let i = 0; i < attachments.length; i++) {
                formData.append("attachments", attachments[i]);
            }

            try {
                const response = await fetch("http://localhost:5000/send-emails", {
                    method: "POST",
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }

                const result = await response.json();

                if (!result || typeof result !== "object") {
                    throw new Error("Invalid response format from server.");
                }

                if (result.success) {
                    if (Array.isArray(result.sentEmails)) {
                        result.sentEmails.forEach(entry => {
                            let li = document.createElement("li");
                            li.textContent = `✅ Email sent to: ${entry.recipient} with attachments: ${entry.attachments.length > 0 ? entry.attachments.join(", ") : "[]"}`;
                            li.style.color = "green";
                            statusList.appendChild(li);
                        });
                    } else {
                        console.warn("⚠️ 'sentEmails' is not an array.");
                    }

                    if (Array.isArray(result.failedEmails)) {
                        result.failedEmails.forEach(entry => {
                            let li = document.createElement("li");
                            li.textContent = `❌ Failed to send email to: ${entry.recipient} (Error: ${entry.error})`;
                            li.style.color = "red";
                            statusList.appendChild(li);
                        });
                    } else {
                        console.warn("⚠️ 'failedEmails' is not an array.");
                    }

                    statusBox.style.display = "block";
                    showPopup(statusList.innerHTML); // ✅ Show Popup with Status
                }

            } catch (error) {
                let errorMsg = document.createElement("li");
                errorMsg.textContent = `❌ Error: ${error.message}`;
                errorMsg.style.color = "red";
                statusList.appendChild(errorMsg);
                statusBox.style.display = "block";
                console.error("❌ Fetch error:", error);
            }
        });
    } else {
        console.error("❌ sendEmails button not found in the DOM.");
    }
});

// // ✅ Show Popup with Email Status
// function showPopup(statusMessage) {
//     const popup = document.getElementById("popup");
//     const statusElement = document.getElementById("popupStatus");

//     if (popup && statusElement) {
//         statusElement.innerHTML = statusMessage;
//         popup.style.display = "block";
//     } else {
//         console.error("❌ Popup elements not found.");
//     }
// }

// // ✅ Close Popup
// function closePopup() {
//     const popup = document.getElementById("popup");
//     if (popup) {
//         popup.style.display = "none";
//     }
// }
