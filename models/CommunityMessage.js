import mongoose from 'mongoose';

const CommunityMessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please provide message text'],
    },
    senderUid: {
        type: String,
        required: [true, 'Sender UID is required'],
    },
    senderName: {
        type: String,
        required: [true, 'Sender name is required'],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.CommunityMessage || mongoose.model('CommunityMessage', CommunityMessageSchema);
