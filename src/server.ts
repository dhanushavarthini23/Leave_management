import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import { logRequest, checkAuthorization } from './middlewares'; // Import middlewares
import employeeRoutes from './routes/employeeRoutes'; // Import employee routes
import leaveRoutes from './routes/leaveRoutes'; // Import leave-related routes
import AppDataSource from './data-source';  // Import TypeORM connection setup

dotenv.config();

const init = async () => {
  // Initialize TypeORM connection and synchronize schema
  try {
    await AppDataSource.initialize();
    console.log('Entities:', AppDataSource.entityMetadatas.map(e => e.name));
    console.log('Database connected successfully!');

    // This will automatically create tables from your entities
    await AppDataSource.synchronize();
    console.log('Database schema synchronized.');
  } catch (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);  // Exit if DB connection fails
  }

  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: 'localhost',
  });
  (server.app as { dataSource: typeof AppDataSource }).dataSource = AppDataSource;


  server.ext('onRequest', logRequest);

  server.route(employeeRoutes); // Employee routes
  server.route(leaveRoutes);    // Leave management routes

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.response('Welcome to the Leave Management API!').code(200);
    },
  });

  // Start the server after DB connection is established
  try {
    console.log(server.table());
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
