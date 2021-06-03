const sgMail = require("@sendgrid/mail");
const Mailgen = require("mailgen");

require("dotenv").config();

class EmailService {
  #sender = sgMail;
  #GenerateTemplate = Mailgen;
  
  #createTemplate(verificationToken) {
    const mailGenerator = new this.#GenerateTemplate({
      theme: "salted",
      product: {
        name: "System Contacts",
        link: "http://localhost:3000/",
      },
    });
    const template = {
      body: {
        intro: "Welcome to System Contacts!",
        action: {
          instructions: "To get started with System Contacts, please click here:",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Confirm your account",
            link: `http://localhost:3000/api/users/verify/${verificationToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    return mailGenerator.generate(template);
  }

  async sendEmail(verificationToken, email) {
    const emailBody = this.#createTemplate(verificationToken);
    this.#sender.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: "99.kara.99@gmail.com", // Use the email address or domain you verified above
      subject: "Confirmation of registration",
      html: emailBody,
    };
    await this.#sender.send(msg);
  }
}

module.exports = EmailService;
