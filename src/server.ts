import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import { logRequest, checkAuthorization } from './middlewares'; // Import middlewares
import employeeRoutes from './routes/employeeRoutes'; // Import routes

dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: 'localhost',
  });

  // Register middleware
  server.ext('onRequest', logRequest);  // Log every incoming request
  //server.ext('onPreHandler', checkAuthorization);  // Authorization check for all routes

  // Register routes
  server.route(employeeRoutes);

  // Define the root route ("/")
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.response('Welcome to the Leave Management API!').code(200);
    },
  });

  try {
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

init().catch((err) => {
  console.error('Error in initialization:', err);
  process.exit(1);
});
