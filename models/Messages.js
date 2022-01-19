const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
        chatId: {
            type: Array,
            required: true,
        },

        messages: [
            {
                conversationId: {
                    type: String
                },
                time: {
                    type: String
                },
                message: {
                    type: String
                }
            }
        ]

    },
    {
        timestamps: true
    })

const Message = mongoose.model("Message", MessageSchema)

module.exports = Message