const express = require("express");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
const Papa = require("papaparse");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json()); // ✅ Fix undefined req.body
app.use(express.urlencoded({ extended: true }));

// Resolve path for static assets
const isPkg = typeof process.pkg !== "undefined";
const basePath = isPkg ? path.dirname(process.execPath) : __dirname;
const publicPath = path.join(basePath, "public");
const uploadPath = path.join(basePath, "uploads");

if (!fs.existsSync(publicPath)) {
    console.error("⚠️ Public folder not found! Ensure it is included.");
}
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const upload = multer({ dest: uploadPath });

app.post("/send-emails", upload.fields([{ name: "csvFile" }, { name: "attachments" }]), async (req, res) => {
    console.log("📩 Received request:", req.body);
    const { senderEmail, senderPassword, subject, emailBody } = req.body;
    const csvFile = req.files["csvFile"] ? req.files["csvFile"][0] : null;
    const attachments = req.files["attachments"] || [];

    if (!senderEmail || !senderPassword || !csvFile) {
        console.error("❌ Missing required fields");
        return res.json({ success: false, message: "Missing required fields" });
    }

    console.log("📑 Processing CSV:", csvFile.path);

    const csvData = fs.readFileSync(csvFile.path, "utf8");
    const parsedData = Papa.parse(csvData, { header: true }).data;

    console.log("📋 Parsed Data:", parsedData);

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: senderEmail,
            pass: senderPassword
        }
    });

    let sentEmails = [];
    let failedEmails = [];

    for (const row of parsedData) {
        const recipient = row["email"]?.trim();
        const name = row["name"]?.trim() || "there"; // Default name if empty
        const attachmentNames = row["attachment"] ? row["attachment"].split(",").map(a => a.trim()) : [];

        if (!recipient) {
            console.warn("⚠️ Skipping row: No recipient email found", row);
            continue;
        }

        // Replace {{name}} in the email body dynamically
        let personalizedEmailBody = emailBody.replace(/{{name}}/g, name);

        let matchedAttachments = attachments
            .filter(file => attachmentNames.includes(file.originalname))
            .map(file => ({ filename: file.originalname, path: file.path }));

        let mailOptions = {
            from: senderEmail,
            to: recipient,
            subject: subject || `Hello, ${name}`,
            text: personalizedEmailBody,
            attachments: matchedAttachments
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Email sent to: ${recipient} with attachments:`, matchedAttachments.map(a => a.filename));
            sentEmails.push({ recipient, attachments: matchedAttachments.map(a => a.filename) });
        } catch (error) {
            console.error(`❌ Failed to send email to ${recipient}:`, error);
            failedEmails.push({ recipient, error: error.message });
        }
    }

    res.json({
        success: true,
        message: "Emails processed!",
        sentEmails,
        failedEmails
    });
});

app.use(express.static(publicPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "popup.html"));
});

app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});
