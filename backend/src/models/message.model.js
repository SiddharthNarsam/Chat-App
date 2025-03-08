import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiverId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text:{
            type: String
        },
        Image:{
            typ:String
        },

    },
    { timestamps:true }
);

const Message = mongoose.model("Message",messageSchema);

export default Message;