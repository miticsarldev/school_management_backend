import { Document, Schema } from "mongoose";

export interface ITimetable extends Document {
    _id: Schema.Types.ObjectId;
    cours_id: Schema.Types.ObjectId;
    id_users: Schema.Types.ObjectId;
    classroom_id: Schema.Types.ObjectId;
    day: string;  
    start_time: string;
    end_time: string;  
}