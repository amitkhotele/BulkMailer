# 📧 Bulk Mailer (Offline)

A privacy-first, fully offline **Chrome Extension** for sending personalized bulk emails using data from a CSV file. Ideal for sending emails with attachments to multiple recipients—perfect for event invites, results, newsletters, and more.

---

## 🚀 Features

- ✅ **CSV-based personalization**: Automatically replace `{{name}}` in the email body with each recipient's name from the CSV.
- 📂 **Attachment mapping**: Match attachment filenames from a folder with corresponding names in the CSV file.
- 🧠 **Offline-first design**: No server required. All data is processed locally.
- 🔒 **Secure credentials**: Email credentials stored safely using Chrome Storage API.
- 🔁 **Automated bulk sending**: Sends emails in one go once everything is set up.
- 📬 **Flexible sending options**:
  - Gmail API with OAuth
  - OR Python Native Messaging bridge for SMTP

---

## 📁 File Structure

```
bulk-mailer-extension/
│
├── manifest.json              # Chrome extension manifest
├── popup.html                 # User interface
├── popup.js                   # Handles user input and logic
├── background.js              # Background script for processing
├── style.css                  # Basic UI styling
├── icons/                     # Extension icons
├── scripts/
│   └── native_emailer.py      # (Optional) Python SMTP sender via Native Messaging
└── sample.csv                 # Example CSV input
```

---

## 🛠️ How It Works

1. **Upload a CSV** with columns like:
   ```
   name,email,attachment
   Amit,amit@example.com,amit_resume.pdf
   Hemant,Hemant@example.com,my_offer.pdf
   ```

2. **Select an attachment folder**  
   - Files must match the attachment column in the CSV.

3. **Enter email subject, body, and your email credentials**

4. **Click Send**  
   - The extension replaces `{{name}}` with the actual name.
   - Attaches the correct file for each recipient.
   - Sends emails using the configured method (OAuth or SMTP).

---

## 🔐 Authentication Methods

### ✅ Option 1: Gmail API (OAuth 2.0)
- Secure and recommended for long-term use.
- Requires Google Cloud Project with Gmail API enabled.

### 🐍 Option 2: Native Messaging via Python
- Python script handles SMTP email sending.
- Requires user to install Python and approve native messaging host.

---

## 🧪 Demo
<img width="1920" height="1080" alt="Screenshot 2025-07-26 151801" src="https://github.com/user-attachments/assets/7947578c-b998-4870-90b5-32d9b3ee2016" />


## 📦 Installation

1. Clone this repo
2. Go to `chrome://extensions/` in your browser
3. Enable **Developer Mode**
4. Click **Load Unpacked** and select the `bulk-mailer-extension` folder

---

## 🙌 Author

**Amit Khotele**  
🔗 [LinkedIn](https://linkedin.com/in/amitkhotele)  
📧 akcodx@gmail.com


