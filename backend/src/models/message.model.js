import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema(
    {   
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User",
        }, 
        receiverId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User",
        },
        text:{
            type:String,
            required:true,
        },
        image:{
            type:String,
        },
    },
    {
        timestamps:true,
    }
);

const Message = mongoose.model("Message", messagesSchema);

export default Message;