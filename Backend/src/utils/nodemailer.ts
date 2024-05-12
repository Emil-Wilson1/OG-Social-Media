import nodemailer from 'nodemailer'; 


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

async function sendOTP(email:string, otp:number) {
  try {

    await transporter.sendMail({
      from: process.env.EMAIL,
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


async function sendReset(email:string, resetLink:string) {
  try {

    await transporter.sendMail({
      from: 'emilwilson67@gmail.com',
      to: email,
      subject: 'Reset Password',
      text: `Click the link to reset your password: ${resetLink}`
    });

    console.log(`Reset link sent to ${email}`);
  } catch (error) {
    console.error('Error sending link via email:', error);
    throw new Error('Failed to send link');
  }
}

export default {
  sendOTP,
  sendReset
};