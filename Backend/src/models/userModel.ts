import { Schema, model, Document, Types } from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface User {
    username: string;
    email: string;
    password: string;
    resetToken?:string;
    fullname: string;
    profilePic?: string;
    phone?: string;
    bio?: string;
    gender?:string;
    chatList: Types.ObjectId[];
    savedPosts: Types.ObjectId[];
    followers: Types.ObjectId[];  
    following: Types.ObjectId[];
    online: boolean;
    blocked: boolean;
    verified: boolean;
    birthdate: Date;
    isPrivate: boolean;
    followRequests:Types.ObjectId[];
}

export interface UserDocument extends User, Document {}

const userSchema = new Schema<UserDocument>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 4,
        maxlength: 30,
        set: function (value: string) {
            return value.toLowerCase();
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: emailRegex,
        set: function (value: string) {
            return value.toLowerCase();
        },
    },
    password: {
        type: String,
    },
    resetToken: {
        type: String,
    },
    birthdate: { type: Date},
    fullname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
    },
    profilePic: {
        type: String,
        trim: true,
        default: "https://res.cloudinary.com/de3cijula/image/upload/v1723188261/vector-flat-illustration-grayscale-avatar-600nw-2264922221_epwxnw.webp",
    },
    phone: {
        type: String,
        trim: true,
        minlength: 10,
    },
    followers: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },
    following: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 200,
    },
    gender:{
        type:String,
        trim:true,
        maxlength:5
    },
    chatList: {
        type: [{ type: Types.ObjectId, ref: "User" }],
        default: [],
    },
    savedPosts: {
        type: [{ type: Types.ObjectId, ref: "Post" }],
        default: [],
    },
    online: {
        type: Boolean,
        default: false,
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    isPrivate: {
        type: Boolean,
        default: false,
    },
    followRequests:{
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        default: []
    } 
}, {
    timestamps: true
});

const User = model<UserDocument>('User', userSchema);

export default User;
