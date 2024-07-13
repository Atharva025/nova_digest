import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/form_details', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((error) => {
        console.error('Error connecting to the database', error);
    });