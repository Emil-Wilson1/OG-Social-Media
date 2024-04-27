import { Schema, model, Document, Types } from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface User {
    username: string;
    email: string;
    password: string;
    fullname: string;
    profilePic?: string;
    phone?: string;
    bio?: string;
    gender?:string;
    chatList: Types.ObjectId[];
    savedPosts: Types.ObjectId[];
    online: boolean;
    blocked: boolean;
    verified: boolean;
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
    fullname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
    },
    profilePic: {
        type: String,
        trim: true,
        default: "https://res.cloudinary.com/de3cijula/image/upload/v1708679555/cld-sample-5.jpg",
    },
    phone: {
        type: String,
        trim: true,
        minlength: 10,
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
}, {
    timestamps: true
});

const User = model<UserDocument>('User', userSchema);

export default User;
