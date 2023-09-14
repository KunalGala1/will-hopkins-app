const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const AWS = require("aws-sdk");

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  SES: new AWS.SES({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-2",
  }),
});

router.post("/mailsend", async (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log("Data: ", req.body);

  const messageHtml = message.replace(/\n/g, "<br>");

  const output = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Contact Request</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">
  
  <div style="background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
      <p style="font-size: 16px;">You have a new contact request for will-hopkins.com!</p>
      
      <h3 style="font-size: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; margin-top: 20px; color: #0077b6;">Contact Details</h3>
      
      <ul style="list-style-type: none; padding: 0;">
          <li style="font-size: 16px; padding: 5px 0;"><span style="color: #0077b6;">•</span> Name: ${name}</li>
          <li style="font-size: 16px; padding: 5px 0;"><span style="color: #0077b6;">•</span> Email: ${email}</li>
          <li style="font-size: 16px; padding: 5px 0;"><span style="color: #0077b6;">•</span> Subject: ${subject}</li>
      </ul>
      
      <h3 style="font-size: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; margin-top: 20px; color: #0077b6;">Message</h3>
      
      <p style="font-size: 16px;">${messageHtml}</p>
  </div>
  
  </body>
  </html>
  
  `;

  const mailOptions = {
    from: "k2awesomeness@gmail.com",
    to: ["k2awesomeness@gmail.com", "willhop7@gmail.com"],
    subject: subject,
    html: output,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ msg: "Email has been sent" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error sending email");
  }
});

module.exports = router;
