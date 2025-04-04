import fs from "fs";
import path from "path";
import ejs from "ejs";
import { fileURLToPath } from "url";
import mailer from "nodemailer";

async function sendMailTemplate(item, template) {
  try {
    const mailTransporter = mailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.Auth_MAIL,
    pass: process.env.Auth_PASS,
  },
});
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const templatePath = path.join(__dirname, "templates", template.url);

    const templatefile = fs.readFileSync(templatePath, "utf-8");

    const html = ejs.render(templatefile, template);

    const mailingdetail = {
      from: process.env.Auth_MAIL,
      to: item.email,
      subject: item.Sub,
      html,
    };
    

    const isMailSend = await mailTransporter.sendMail(mailingdetail);
    // console.log("mainsend",isMailSend);
    if (!isMailSend) {
      console.error("Failed to send mail", isMailSend);
        return false;
    }
    return true;

  } catch (err) {
  console.error("Error sending mail:", err);
  return false;
}
}

export default sendMailTemplate;
