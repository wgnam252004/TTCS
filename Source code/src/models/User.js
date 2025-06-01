import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
},
    { timestamps: true }
);

const User = model('User', UserSchema);
export default User;