import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Make username unique
    },
    password: {
        type: String,
        required: true,
    },
    genre: [String],
    bookmarks: [{
        title: String,
        author: String,
        description: String,
        url: String,
        urlToImage: String,
        publishedAt: String,
        content: String,
        tag: { type: String, default: 'General' }
    }],
    email: {
        type: String,
        default: ''
    },
    searchHistory: [String],
    readArticlesCount: {
        type: Number,
        default: 0
    },
    readingStreak: {
        count: { type: Number, default: 0 },
        lastRead: Date
    },
    readGenres: [{
        name: String,
        count: { type: Number, default: 0 }
    }]
});

export default mongoose.model('form_filling', userSchema);