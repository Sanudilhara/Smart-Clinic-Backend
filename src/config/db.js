import {Sequelize} from 'sequelize'; //Import Sequelize library to interact with PostgreSQL database
import "dotenv/config"; //Import dotenv to manage environment variables
// Create a new Sequelize instance with database connection parameters from environment variables
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        dialect: 'postgres',
    }       
);

// Test connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully via Sequelize.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export { sequelize, connectDB };
