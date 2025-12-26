import mongoose from "mongoose";

const eventSchema=mongoose.Schema({
    profile:[{type:mongoose.Schema.ObjectId,ref:'Profile'}],
    timezone:{type:String,required:true},
    startDate:{type:Date,required:true},
    endDate:{type:Date,required:true}
});

const Event=mongoose.model("Event",eventSchema);
export default Event;