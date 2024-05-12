import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ReportAttrs {
    reporterId:Types.ObjectId;
    reporterUsername: string;
    reportType: string;
    targetId: Schema.Types.ObjectId;
    details?: string;
    actionTaken?: boolean;
}

export interface ReportDoc extends ReportAttrs, Document {}



const reportSchema = new Schema<ReportDoc>({
    reporterId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reporterUsername: {
        type: String,
        required: true
    },
    reportType: {
        type: String,
        required: true
    },
    targetId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    details: {
        type: String,
        // required: true
    },
    actionTaken: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

const reportUserModel = mongoose.model<ReportDoc>('report', reportSchema);
export default reportUserModel;

