const SibApiV3Sdk = require("sib-api-v3-sdk");
require("dotenv").config();

// Initialize Brevo client
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const sendEmail = async ({ to, subject, html }) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = {
      sender: {
        name: "Matrimony Platform",
        email: "rishabhadhikari321@gmail.com",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Brevo email error:", error);
  }
};

module.exports = sendEmail;