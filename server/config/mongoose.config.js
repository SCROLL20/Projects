//* Import the `connect` method from mongoose library to establish a connection with MongoDB
import { connect } from 'mongoose';
//* Import the dotenv package to load environment variables from the .env file
import dotenv from 'dotenv';

//* Load environment variables
dotenv.config();

//* Extract MongoDB URI and database name from environment variables
const MONGO_URI = process.env.MONGO_DB_URI; // MongoDB URI
const DB = process.env.DB; // Database name

/**
 * Establish a connection to MongoDB database
 * This function connects to the the datyabase specified by the MONGO_URI and DB environment variable
 * 
 **/ 

async function dbConnect() {
    try {
        await connect(MONGO_URI, {
            dbName: DB,
        });
        console.log(`Pinged your deployment. You successfully connected to MongoDB! and your DB is : ${DB}`);
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export default dbConnect;