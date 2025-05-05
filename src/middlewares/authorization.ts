import { Request, ResponseToolkit } from '@hapi/hapi';

export const checkAuthorization = async (request: Request, h: ResponseToolkit) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return h.response({ error: 'Unauthorized' }).code(401); // No authorization header found
  }

  // Check if the header starts with 'Bearer'
  const token = authHeader.split(' ')[1];
  if (!token) {
    return h.response({ error: 'Unauthorized' }).code(401); // Missing token
  }

  // Example: Checking for a hardcoded token (replace with your logic)
  if (token !== 'valid_token') {
    return h.response({ error: 'Forbidden' }).code(403); // Invalid token
  }

  return h.continue; // Allow the request to proceed to the handler if authorized
};