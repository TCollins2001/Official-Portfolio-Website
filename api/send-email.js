import FormData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.API_KEY,
});

export default async function handler(req, res) {

res.setHeader("Access-Control-Allow-Origin", "https://tc-web-designs.com/");
res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");

if (req.method === "OPTIONS") {
  return res.status(200).end(); 
}

  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { firstName, lastName, userEmail, PrefPref, comments } = req.body;

  const domain = "tc-web-designs.com/";
  
    const businessEmailData = {
      from: "TC WEB DESIGN SERVICES <postmaster@tc-web-designs.com/>",
      to: "teonvioncollins@gmail.com",
      subject: "New Website Request Received",
        html: `
          <div style="background: linear-gradient(135deg, #ef4136, #fbb040); color: white; text-align: center; padding: 15px;">
    <h2 style="margin: 0; font-size: 22px; text-align: center;">
      New Website Request
  </h2>
  </div>
    
    <!-- Email Body -->
    <div style="padding: 20px;">
      <p style="font-size: 16px;">A new website request has been submitted.</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 2px solid orangered;">
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${firstName} ${lastName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${userEmail}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Preferred Website:</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${PrefPref}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Additional Comments:</td>
          <td colspan="3" style="padding: 10px; border: 1px solid #ddd;">${comments || "N/A"}</td>
        </tr>
      </table>

      <p style="margin-top: 20px; font-size: 16px;">Please follow up with the customer to confirm and process the order.</p>
    </div>

    <!-- Footer -->
    <div style="background: linear-gradient(135deg, #ef4136, #fbb040); color: white; text-align: center; padding: 10px; font-size: 14px;">
      <p style="margin: 0;">TC WEB DESIGN SERVICES</p>
      <p style="margin: 0; color: #FFFFFF">Email: tcwebdesignservices@gmail.com</p>
    </div>
  </div>
        `
      };
  


    const userEmailData = {
      from: "TC WEB DESIGN SERVICES <postmaster@tc-web-designs.com/>",
      to: userEmail,
      subject: "Your Website Request Confirmation",
      html: `
        <div style="background: linear-gradient(135deg, #ef4136, #fbb040); color: white; text-align: center; padding: 15px;">
    <h2 style="margin: 0; font-size: 22px;">
      Website Request Confirmation
  </h2>
  </div>
  
  <!-- Email Body -->
  <div style="padding: 20px;">
    <p style="font-size: 16px;">Hi ${firstName},</p>
    
    <p style="font-size: 16px;">Thank you for your website request! Here are your request details: </p>

    <table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 2px solid orangered;">
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${firstName} ${lastName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${userEmail}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Preferred Website:</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${PrefPref}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Additional Comments:</td>
          <td colspan="3" style="padding: 10px; border: 1px solid #ddd;">${comments || "N/A"}</td>
        </tr>
      </table>

    <p style="margin-top: 20px; font-size: 16px;">
      We will contact you shortly via email to confirm and begin the process. If you have any further questions, feel free to reply to this email.
    </p>
    
    <p style="margin-top: 20px; font-size: 16px;">Best,</p>
    <p style="font-size: 16px;">TC WEB DESIGN SERVICES</p>
  </div>
  
  <!-- Footer -->
  <div style="background: linear-gradient(135deg, #ef4136, #fbb040); color: white; text-align: center; padding: 10px; font-size: 14px;">
    <p style="margin: 0;">TC WEB DESIGN SERVICES</p>
      <p style="margin: 0; color: #FFFFFF">Email: tcwebdesignservices@gmail.com</p>
  </div>
</div>
      `
    };

  try {
    await mg.messages.create(domain, businessEmailData);
    await mg.messages.create(domain, userEmailData);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending mail:", error);
    return res.status(500).json({ success: false, error: "Mailgun error" });
  }
}
