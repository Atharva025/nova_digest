import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("CRITICAL ERROR: MONGODB_URI environment variable is not defined!");
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to Atlas MongoDB Database successfully');
    })
    .catch((error) => {
        console.error('Error connecting to Atlas MongoDB Database:', error);
    });