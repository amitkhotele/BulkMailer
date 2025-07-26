chrome.runtime.onMessage.addListener((message, _ , sendResponse) => {
    console.log("Received message in background.js:", message);

    if (message.action === "sendEmails") {
        console.log("Preparing to send emails...");
        sendEmails(message.csvPath, message.attachmentFiles, message.senderEmail, message.senderPassword);
        sendResponse({ success: true });
    }
});
