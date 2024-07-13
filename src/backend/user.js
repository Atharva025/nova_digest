import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    genre: [{
        type: String,
        required: true
    }]
});

export default mongoose.model('form_filling', userSchema);