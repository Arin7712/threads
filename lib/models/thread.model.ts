import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
    text:{type: String, required: true},
    image: {type: String},
    author: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    },
    createdAt: {
        type: Date,
        default: new Date()
    }, 
    editedAt: {
        type: Date,
        default: new Date()
    },
    parentId: {
        type: String
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ], likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema);
export default Thread;