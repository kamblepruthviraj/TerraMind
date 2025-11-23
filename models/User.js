import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        select: false, // Do not return password by default
    },
    role: {
        type: String,
        enum: ['farmer', 'counsellor', 'admin'],
        default: 'farmer',
    },
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    phone: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
