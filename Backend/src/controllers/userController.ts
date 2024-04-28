
import { Request, Response } from 'express';
import authService from '../services/userService';
import generateOTP from '../utils/generateOtp';
import userRepository from '../repositories/userRepository';
import nodemailer from '../utils/nodemailer';
import User, { UserDocument } from '../models/userModel';
import { tempUserDocument } from '../models/tempUserModel';


export const signup = async (req: Request, res: Response) => {
  const { fullname,email, username, password } = req.body;


  try {
    let otp=generateOTP()
    const token = await authService.signup(fullname,email,username,password); 
   
    // await userRepository.saveOTP(otp);
    // await nodemailer.sendOTP(email, otp);
    res.status(201).json({ message:"User Created Successfully!",token,email});
    setTimeout(async () => {
      try {
        // Save OTP in the database
        const savedOTP = await userRepository.saveOTP(email, otp);
        if (!savedOTP) {
          throw new Error('Failed to save OTP');
        }

        // Send OTP via email
        await nodemailer.sendOTP(email, otp);
        console.log('OTP saved and sent successfully');

        // Delete OTP after 90 seconds (90000 milliseconds)
        setTimeout(async () => {
          try {
            await userRepository.deleteOTP(email);
            console.log('OTP deleted successfully after 90 seconds');
          } catch (error) {
            console.error('Error deleting OTP:', error);
          }
        }, 90000); // 90 seconds (90000 milliseconds)
      } catch (error) {
        console.error('Error saving or sending OTP:', error);
      }
    }, 2000);

  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};
export const login = async (req: Request, res: Response) => {
  const {email, password } = req.body;

  try {
    const result= await authService.login(email, password);

    if (typeof result === 'string') {
      const token = result;
      const userId = await authService.getUserIdFromToken(token);
      console.log("token decode:",userId);
      
      res.status(201).json({ token,userId }); // Return token if authentication is successful
    } else if ('emailMatch' in result) {
      res.status(401).json({ message: 'Email not found' }); // Return email not found error
    } else if ('passMatch' in result) {
      res.status(401).json({ message: 'Incorrect password' }); // Return incorrect password error
    } else {
      res.status(500).json({ message: 'Login failed' }); // Fallback for generic error
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};


export const verifyOTP = async (req: Request, res: Response) => {
  const { email, enteredOTP } = req.body;

  try {
   
    const isOTPValid = await authService.verifyOTP(email, enteredOTP);

    if (isOTPValid) {
  
      const tempUser = await userRepository.findByEmailTemp(email);
      console.log(tempUser)
      if (!tempUser) {
        // Temp user data not found
        return res.status(404).json({ message: 'Temporary user data not found' });
      }
      const newUser: UserDocument = new User({
        email: tempUser.email,
        fullname: tempUser.fullname,
        password: tempUser.password, // Ensure password is hashed before saving
        username: tempUser.username,
        verified: true // Assuming the user is verified upon OTP validation
      });

      // Save the new user document to the database
      await newUser.save();
      res.status(200).json({ message: 'OTP verification successful' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};






export const fetchUserById = async (req: Request, res: Response) => {
  const  id  = req.query.id;
console.log(id)
  try {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid _id parameter in request' });
    }
    console.log(id)
    const user = await userRepository.findUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};




// Update user profile route
export const editProfile= async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string | undefined; // Ensure id is a string or undefined
    console.log("User id editprofile:",id);
    if (!id) {
      throw new Error('User ID is missing in the query parameters');
    }
    const { fullname, username, gender, bio } = req.body;
    let profilePic = ''; // Default profile picture URL
    // Check if profile picture is uploaded
    console.log(req.file)
    if (req.file) {
      // Upload image to Cloudinary
      profilePic = await authService.uploadImage(req.file);
      console.log("Profilepic:",profilePic);
      
    }

     await userRepository.updateUserProfile(id, {
      fullname,
      username,
      gender,
      bio,
      profilePic
    });

    res.json({ success: true, message: 'User profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user profile', error: error });
  }
};




export const forgotPassword= async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    // Call the sendPasswordResetEmail method to handle sending the reset email
    const result = await authService.sendPasswordResetEmail(email);
    // Return the result message
    res.status(200).json({message:"Reset password link sent successfully!"});
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({meassage:'Internal server error'});
  }
}



export const resetPassword=async (req: Request, res: Response)=> {
  const token: string | undefined = req.query.token as string;
  const { newPassword } = req.body;

  try {
    if (!token) {
      throw new Error('Token is missing');
    }
    await authService.resetPassword(token, newPassword);
    res.status(200).json({meassage:'Password reset successfully'});
  } catch (error) {
    res.status(400).json({error});
  }
}





