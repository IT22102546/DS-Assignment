import transporter from "../config/MailConfig.js"

 const sendEmail = async (req, res) => {
  const { to, text } = req.body;

  try {
    const info = await transporter.sendMail({
      from: `"OB Taste" <${process.env.EMAIL_USER}>`,
      to,
      subject:"",
      text
    });

    console.log('Email sent:', info.messageId);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
};


export default sendEmail


