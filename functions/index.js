/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const cors = require("cors")({ origin: true });
const sgMail = require("@sendgrid/mail");
const { defineSecret } = require("firebase-functions/params");

setGlobalOptions({ maxInstances: 10 });

const sendgridApiKey = defineSecret("SENDGRID_API_KEY");

exports.sendSupportEmail = onRequest(
  { secrets: [sendgridApiKey], cors: true },
  (request, response) => {
    cors(request, response, async () => {
      try {
        if (request.method !== "POST") {
          response.status(405).send("Method Not Allowed");
          return;
        }

        sgMail.setApiKey(sendgridApiKey.value().trim());
        
        const { name, email, phone, company, message } = request.body.data || request.body; // handle direct fetch or call

        const msg = {
          to: ['joseph@decentgradient.com', 'friedmanym@gmail.com'],
          from: 'alerts@cybershomrim.org', // Must be an authenticated sender domain in SendGrid
          subject: `New Support Request from ${name || 'Unknown'}`,
          text: `
Name: ${name || 'N/A'}
Email: ${email || 'N/A'}
Phone: ${phone || 'N/A'}
Company: ${company || 'N/A'}
Message: ${message || 'N/A'}
          `,
        };

        await sgMail.send(msg);
        response.status(200).json({ data: { success: true, message: "Email sent successfully" } }); 
        // We wrap in data:{} in case the client uses standard Callable function format, but they can just use standard fetch.
      } catch (error) {
        logger.error("Error sending email", error.response ? error.response.body : error);
        response.status(500).json({ data: { success: false, error: "Failed to send email" } });
      }
    });
  }
);
