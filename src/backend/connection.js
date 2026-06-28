import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://atharva070720_db_user:hlw3vmDVMz2gbJtS@nova-digest-data.4rrib0j.mongodb.net/nova_digest?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to Atlas MongoDB Database successfully');
    })
    .catch((error) => {
        console.error('Error connecting to Atlas MongoDB Database:', error);
    });