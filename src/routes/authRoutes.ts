import { Request, ResponseToolkit } from '@hapi/hapi';
import jwt from 'jsonwebtoken';
import { ServerRoute } from '@hapi/hapi'
const JWT_SECRET = process.env.JWT_SECRET || 'sD7@8kj1!ld$gF30P1wz';

// Define the login handler
const loginHandler = (request: Request, h: ResponseToolkit) => {
  const { username, password } = request.payload as any; // Add validation logic

  // Check credentials (you can replace this with your actual authentication logic)
  if (username === 'admin' && password === 'password') {
    const payload = { id: 1, username: 'admin', role: 'manager' }; // Customize payload
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return h.response({ message: 'Login successful', token }).code(200);
  }

  return h.response({ message: 'Invalid credentials' }).code(401);
};

// Correct type definition for routes
export const authRoutes: ServerRoute[] = [
    {
      method: 'POST',
      path: '/login',
      options: {
        auth: false, // ✅ explicitly allowed
      },
      handler: loginHandler,
    },
  ];
