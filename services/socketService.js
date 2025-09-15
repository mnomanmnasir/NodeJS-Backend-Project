const { Server } = require('socket.io')
const User = require("../models/User");
const Message = require("../Models/Messgaes");

// Map to store online users => userId, socketId
const onlineUsers = new Map();

// Map to track typing status => userId => [conversation]: boolean
const typingUsers = new Map()

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
            method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        },
        pingTimeout: 60000, //DISCONNECT inactive users or socket after 60secs
    });


    // when a new socket 
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`)
        let userId = null

        // handle user connection and mark them online in db

        socket.on('user_connected', async (connectingUserId) => {
            try {
                userId = connectingUserId
                onlineUsers.set(userId, socket.id)
                socket.join(userId) //join personal room for direct emit

                // update user status in db
                await User.findByIdAndUpdate(userId, {
                    isOnline: true,
                    lastSeen: new Date(),
                })

                // notify all users that this user is now online
                io.emit("user_status", { userId, isOnline: true })

            }

            catch (error) {
                console.log("User handling connection", error)
            }
        })

        // Return online status off requested user 
        socket.on("get_user_status", (requestedUserId, callback) => {
            const isOnline = onlineUsers.has(requestedUserId)
            callback({
                userId: requestedUserId,
                isOnline,
                lastSeen: isOnline ? new Date() : null
            })
        })

        //forward message to receiver
        socket.on("send_message", async (message) => {
            try {
                const receiverSocketId = onlineUsers.get(message.receiver?._id)

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receiver_message", message)
                }
            }
            catch (error) {
                console.log("Error sending message", error)
                socket.emit("message_error", { error: "Failed to send message" })
            }
        })

        // update messages as read and notify sender
        socket.on("message_read", async ({ messageIds, senderId }) => {
            try {
                await Message.updateMany(
                    { _id: { $in: messageIds } },
                    { $set: { messageStatus: "read" } }
                )

                const senderSocketId = onlineUsers.get(senderId);
                if (senderSocketId) {
                    messageIds: forEach((messageId) => {
                        io.to(senderSocketId).emit("message_status_update", {
                            messageId,
                            messageStatus: 'read'
                        })
                    })
                }
            } catch (error) {
                console.error("Error updating message read status", error)
            }
        })

        // handle typing start event and auto-stop  after 3s
        socket.on("typing_start", ({ conversationId, receiverId }) => {
            if (!userId || !conversationId || !receiverId) return;

            if (!typingUsers.has(userId)) typingUsers.set(userId, {});

            const userTyping = typingUsers.get(userId)

            userTyping(conversationId === true);
            // clear any existing timeout

            if (userTyping[`${conversationId}_timeout`]) {
                clearTimeout(userTyping[`${conversationId}_timeout`])
            }

            // auto stop after 3seconds 
            userTyping[`${conversationId}_timeout`] = setTimeout(() => {
                userTyping[conversationId] = false
                socket.to(receiverId).emit("user_typing", {
                    userId,
                    conversationId,
                    isTyping: false
                })
            }, 3000)

            // notify receiver 
            socket.io(receiverId).emit("user_typing", {
                userId,
                conversationId,
                isTyping: true
            })
        })

        socket.on("typing_stop", ({ conversationId, receiverId }) => {
            if (!userId || !conversationId || !receiverId) return;

            if (!typingUsers.has(userId)) {
                const userTyping = typingUsers.get(userId)

                userTyping(conversationId) = false

                if (userTyping[`${conversationId}_timeout`]) {
                    clearTimeout(userTyping[`${conversationId}_timeout`])
                    delete userTyping[`${conversationId}_timeout`]
                }
            }

            socket.to(receiverId).emit("user_typing", {
                userId,
                conversationId,
                isTyping: false
            })
        })

        // add or update reaction on message
        socket.on("add_reaction", async ({ messageId, emoji, userId, reactionUserId }) => {
            try {
                const message = await Message.findyById(messageId);
                if (!message) return

                const existingIndex = message.reaction.findIndex(
                    (r) => r.user.toString() === reactionUserId
                )
                if (existingIndex > -1) {
                    const existing = message.reactions(existingIndex)
                    if (existing.emoji === emoji) {
                        // remove some reaction
                        message.reaction.splice(existingIndex, 1)
                    }
                }
            }
            catch (error) {

            }
        })
    })
}