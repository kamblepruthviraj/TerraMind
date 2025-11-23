import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
    },
    content: {
        type: String,
        required: [true, 'Please provide content'],
    },
    audioURL: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'resolved'],
        default: 'pending',
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    counsellorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
