import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    articleUrl: {
        type: String,
        required: true,
        index: true
    },
    userName: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('ArticleComment', commentSchema);
