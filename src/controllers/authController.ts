// src/controllers/authController.ts
import { Request, ResponseToolkit } from '@hapi/hapi';
import jwt from 'jsonwebtoken';
import AppDataSource from '../data-source'; // TypeORM data source
import { Employee } from '../entities/Employee'; // Assuming Employee entity exists

// Define the JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

export class AuthController {
  // Login route to authenticate user and provide JWT token
  static async login(req: Request, h: ResponseToolkit) {
    const { username, password } = req.payload as { username: string; password: string };

    // Find user in the database by username (you can hash passwords, etc.)
    const userRepo = AppDataSource.getRepository(Employee);
    const user = await userRepo.findOne({ where: { username } });

    if (!user) {
      return h.response({ message: 'Invalid username or password' }).code(401); // User not found
    }

    // Verify password (assuming you have a method to compare)
    const passwordMatch = user.password === password; // Replace this with a hashed password check if needed
    if (!passwordMatch) {
      return h.response({ message: 'Invalid username or password' }).code(401); // Incorrect password
    }

    // Generate a JWT token with user info (e.g., id and role)
    const payload = {
      id: user.id,
      role: user.role, // Assuming your Employee entity has a role
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // 1-hour expiration for the token

    // Return the token to the client
    return h.response({ token }).code(200);
  }
}
