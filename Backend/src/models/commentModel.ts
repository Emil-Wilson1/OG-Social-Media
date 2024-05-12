import mongoose, { Schema, Document, Model } from "mongoose";

interface IComment extends Document {
    userId: Schema.Types.ObjectId;
    postId: Schema.Types.ObjectId;
    content: string;
    parentId?: mongoose.Types.ObjectId;
    deleted?: boolean;
}

export interface CommentDocument extends IComment,Document {}

const commentSchema = new Schema<CommentDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxLength: 500,
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

const commentModel = mongoose.model<CommentDocument>("Comment", commentSchema);

export default commentModel;
