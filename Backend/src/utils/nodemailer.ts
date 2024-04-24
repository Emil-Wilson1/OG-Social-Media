import nodemailer from 'nodemailer'; // Replace with your email sending module

// Create a transporter for sending emails (e.g., using SMTP)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // false for TLS, true for SSL
  auth: {
    user: 'emilwilson67@gmail.com',
    pass: 'fiotgsmmqukncbvj'
  }
});

async function sendOTP(email:string, otp:number) {
  try {
    // Send email with OTP
    await transporter.sendMail({
      from: 'emilwilson67@gmail.com',
      to: email,
      subject: 'Your One-Time Password (OTP)',
      text: `Your OTP is: ${otp}`
    });

    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP via email:', error);
    throw new Error('Failed to send OTP');
  }
}

export default {
  sendOTP
};