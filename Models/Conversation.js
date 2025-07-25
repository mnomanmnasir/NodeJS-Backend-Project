/* This code snippet is defining a Mongoose schema for a conversation in a messaging application.
Here's a breakdown of what each part is doing: */
const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        }
    ],
    lastMessage: { type: mongoose.Schema.ObjectId, ref: 'Message' },
    unreadCount:{type:Number, default:0 }
},{timeStamp: true})

const Conversation = mongoose.model("Conversation", conversationSchema)

module.exports = Conversation;