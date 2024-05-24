import { Request, Response } from "express";
import authService from "../services/userService";
import userRepository from "../repositories/userRepository";
import { HttpStatusCode } from "../types/httpStatus";

// export const signup = async (req: Request, res: Response) => {
//   const { fullname, email, username, password } = req.body;

//   try {
//     let otp = generateOTP();
//     const token = await authService.signup(fullname, email, username, password);

//     // await userRepository.saveOTP(otp);
//     // await nodemailer.sendOTP(email, otp);
//     res
//       .status(201)
//       .json({ message: "User Created Successfully!", token, email });
//     setTimeout(async () => {
//       try {
//         const savedOTP = await userRepository.saveOTP(email, otp);
//         if (!savedOTP) {
//           throw new Error("Failed to save OTP");
//         }

//         await nodemailer.sendOTP(email, otp);
//         console.log("OTP saved and sent successfully");

//         setTimeout(async () => {
//           try {
//             await userRepository.deleteOTP(email);
//             console.log("OTP deleted successfully after 90 seconds");
//           } catch (error) {
//             console.error("Error deleting OTP:", error);
//           }
//         }, 90000);
//       } catch (error) {
//         console.error("Error saving or sending OTP:", error);
//       }
//     }, 2000);
//   } catch (error) {
//     console.error("Error signing up user:", error);
//     res.status(500).json({ message: "Failed to create user" });
//   }
// };



export const signup = async (req: Request, res: Response): Promise<void> => {
  const { fullname, email, username, password } = req.body;
  try {
    await authService.signup(fullname, email, username, password);
    res.status(HttpStatusCode.CREATED).json({ message: 'User created successfully',email:email});
  } catch (error) {
    console.error('Error signing up user:', error);
    let statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Failed to create user';
    if ((error as Error).message === 'User already exists') {
      statusCode = HttpStatusCode.CONFLICT;
      errorMessage = 'User already exists';
    } else if ((error as Error).message === 'Username is already taken') {
      statusCode = HttpStatusCode.CONFLICT;
      errorMessage = 'Username is already taken';
    }
    res.status(statusCode).json({ error: errorMessage });
  }
};


export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Email is required' });
    return;
  }

  try {
    const result = await authService.sendOTP(email);
    if (result) {
      res.status(HttpStatusCode.OK).json({ message: 'OTP sent successfully' });
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

// export const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   try {
//     const result = await authService.login(email, password);

//     if (typeof result === "string") {
//       const token = result;
//       const userId = await authService.getUserIdFromToken(token);
//       console.log("token decode:", userId);
//       res.status(201).json({ token, userId });
//     } else if ("emailMatch" in result) {
//       res.status(401).json({ message: "Email not found" });
//     } else if ("passMatch" in result) {
//       res.status(401).json({ message: "Incorrect password" });
//     } else {
//       res.status(500).json({ message: "Login failed" });
//     }
//   } catch (error) {
//     console.error("Error during login:", error);
//     res.status(500).json({ message: "Login failed" });
//   }
// };

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await authService.login(email, password);
    if ("accessToken" in result && "refreshToken" in result) {
      const { accessToken, refreshToken } = result;
      const userId = await authService.getUserIdFromToken(accessToken);
      console.log("token decode:", userId);
      res.status(HttpStatusCode.CREATED).json({ accessToken, refreshToken, userId });
    } else if ("emailMatch" in result) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Email not found" });
    } else if ("passMatch" in result) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Incorrect password" });
    } else if ("blocked" in result) {
      res.status(HttpStatusCode.FORBIDDEN).json({ message: "User is blocked" });
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Login failed" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Login failed" });
  }
};



export const verifyOTP = async (req: Request, res: Response) => {
  const { email, enteredOTP } = req.body;

  try {
    const isOTPValid = await authService.verifyOTP(email, enteredOTP);

    if (isOTPValid) {
      const newUser = await authService.createUserFromTemp(email);
      if (!newUser) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ message: "Temporary user data not found" });
      }
      return res.status(HttpStatusCode.OK).json({ message: "OTP verification successful" });
    } else {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to verify OTP" });
  }
};

// export const fetchUserById = async (req: Request, res: Response) => {
//   const id = req.query.id;
//   console.log(id);
//   try {
//     if (!id || typeof id !== "string") {
//       return res
//         .status(400)
//         .json({ error: "Invalid _id parameter in request" });
//     }
//     console.log(id);
//     const user = await userRepository.findUserById(id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.status(200).json({ user });
//   } catch (error) {
//     console.error("Error fetching user by ID:", error);
//     res.status(500).json({ error: "Failed to fetch user" });
//   }
// };


export const fetchUserById = async (req: Request, res: Response) => {
  const id = req.query.id as string;
  console.log(id);
  try {
    if (!id || typeof id !== 'string') {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'Invalid ID parameter in request' });
    }
    const user = await authService.fetchUserById(id);
    res.status(HttpStatusCode.OK).json({ user });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Invalid ID parameter') {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
      } else if (error.message === 'User not found') {
        return res.status(HttpStatusCode.NOT_FOUND).json({ error: error.message });
      }
      console.error('Error fetching user by ID:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch user' });
    } else {
      console.error('Unknown error:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch user' });
    }
  }
};

// export const editProfile = async (req: Request, res: Response) => {
//   try {
//     const id = req.query.id as string | undefined;
//     console.log("User id editprofile:", id);
//     if (!id) {
//       throw new Error("User ID is missing in the query parameters");
//     }
//     const { fullname, username, gender, bio } = req.body;
//     let profilePic = "";

//     console.log(req.file);
//     if (req.file) {
//       profilePic = await authService.uploadImage(req.file);
//       console.log("Profilepic:", profilePic);
//     }

//     await userRepository.updateUserProfile(id, {
//       fullname,
//       username,
//       gender,
//       bio,
//       profilePic,
//     });

//     res.json({ success: true, message: "User profile updated successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({
//         success: false,
//         message: "Failed to update user profile",
//         error: error,
//       });
//   }
// };


export const editProfile = async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string | undefined;
    console.log("User id editprofile:", id);
    if (!id) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "User ID is missing in the query parameters",
      });
    }

    const { fullname, username, gender, bio } = req.body;
    let profilePic = "";

    if (req.file) {
      profilePic = await authService.uploadImage(req.file);
      console.log("Profilepic:", profilePic);
    }

    await authService.updateProfile(id, { fullname, username, gender, bio, profilePic });

    res.json({ success: true, message: "User profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update user profile",
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};


// export const forgotPassword = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;

//     const result = await authService.sendPasswordResetEmail(email);

//     res.status(200).json({ message: "Reset password link sent successfully!" });
//   } catch (error) {
//     console.error("Error resetting password:", error);
//     res.status(500).json({ meassage: "Internal server error" });
//   }
// };

// export const resetPassword = async (req: Request, res: Response) => {
//   const token: string | undefined = req.query.token as string;
//   const { newPassword } = req.body;

//   try {
//     if (!token) {
//       throw new Error("Token is missing");
//     }
//     await authService.resetPassword(token, newPassword);
//     res.status(200).json({ meassage: "Password reset successfully" });
//   } catch (error) {
//     res.status(400).json({ error });
//   }
// };

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const result = await authService.sendPasswordResetEmail(email);

    res.status(HttpStatusCode.OK).json({ message: "Reset password link sent successfully!" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const token: string | undefined = req.query.token as string;
  const { newPassword } = req.body;
  try {
    if (!token) {
      throw new Error("Token is missing");
    }
    await authService.resetPassword(token, newPassword);
    res.status(HttpStatusCode.OK).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({ error });
  }
};
