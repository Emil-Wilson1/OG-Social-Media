import JWTUtil  from './../utils/jwt';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import adminRepository from '../repositories/adminRepository';
import { IAdmin } from '../models/adminModel';


class AdminService {

    defaultEmail = 'admin@gmail.com';
  defaultPassword = 'Helloyou@123';


  async login(email: string = this.defaultEmail, password: string = this.defaultPassword): Promise<string | { passMatch: string } | { emailMatch: string }> {
    try {
      let user = await adminRepository.findByEmail(email);
      
      if (!user) {
        // Register the user if they don't exist
        try {
          user = await this.registerUser(email, password);
          return JWTUtil.generateAccessToken(user._id);
        } catch (registrationError) {
          console.error('Error during registration:', registrationError);
          return { emailMatch: "Email Not Found!" };
        }
      } else {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return { passMatch: "Incorrect password" };
        }
  
        const token = JWTUtil.generateAccessToken(user._id);
        return token;
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }
  

  async registerUser(email: string, password: string): Promise<IAdmin> {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10

      // Insert the user into the database with the hashed password
      const newUser = await adminRepository.insertUser(email, hashedPassword);
      
      return newUser;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error; // Propagate the error to the caller
    }
  }





}









export default new AdminService();