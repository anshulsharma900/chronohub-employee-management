import nodemailer from "nodemailer";

export const sendContactMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, email, and message are required" });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Configure transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: parseInt(process.env.SMTP_PORT || 587),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Email to company
        const mailOptions = {
            from: `"ChronoHub Contact" <${process.env.SMTP_USER}>`,
            to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
            replyTo: email,
            subject: `Contact Form: ${subject || "New Message"} - from ${name}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Message</h1>
          </div>
          <div style="background: #1e293b; padding: 30px; border-radius: 0 0 10px 10px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #94a3b8; width: 100px;">Name:</td>
                <td style="padding: 10px 0; color: #f1f5f9; font-weight: bold;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #94a3b8;">Email:</td>
                <td style="padding: 10px 0; color: #f1f5f9;">
                  <a href="mailto:${email}" style="color: #3b82f6;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #94a3b8;">Subject:</td>
                <td style="padding: 10px 0; color: #f1f5f9;">${subject || "No subject"}</td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #334155;">
              <p style="color: #94a3b8; margin-bottom: 10px;">Message:</p>
              <p style="color: #f1f5f9; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        </div>
      `,
        };

        // Auto-reply to sender
        const autoReplyOptions = {
            from: `"ChronoHub" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Thank you for contacting ChronoHub",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thank You, ${name}!</h1>
          </div>
          <div style="background: #1e293b; padding: 30px; border-radius: 0 0 10px 10px; color: #f1f5f9;">
            <p style="line-height: 1.6;">We've received your message and will get back to you as soon as possible.</p>
            <p style="line-height: 1.6; margin-top: 20px;">Here's a copy of your message:</p>
            <div style="background: #0f172a; padding: 20px; border-radius: 8px; margin-top: 10px; border-left: 4px solid #3b82f6;">
              <p style="color: #94a3b8; margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject || "No subject"}</p>
              <p style="color: #f1f5f9; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="margin-top: 30px; color: #94a3b8; font-size: 14px;">
              Best regards,<br/>
              <strong style="color: #3b82f6;">The ChronoHub Team</strong>
            </p>
          </div>
        </div>
      `,
        };

        // Check if SMTP is configured
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            // Log the message instead of sending email (for development)
            console.log("Contact form submission (SMTP not configured):");
            console.log({ name, email, subject, message });
            return res.status(200).json({
                message: "Message received successfully",
                note: "Email delivery pending SMTP configuration"
            });
        }

        // Send emails
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(autoReplyOptions);

        res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error("Contact form error:", error);
        res.status(500).json({ message: "Failed to send message. Please try again later." });
    }
};
