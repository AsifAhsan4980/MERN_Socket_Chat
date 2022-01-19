const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
        userId: {
            type: String,
            required: true,
        },
        friends: [
            {
                friendId: {
                    type: String,
                },

            }
        ],
        requests: [
            {
                friendId: {
                    type: String,
                },
            }
        ],
        sentRequest: [
            {
                friendId: {
                    type: String
                }
            }
        ]

    },
    {
        timestamps: true
    })

const AddFriend = mongoose.model("AddFriend", UserSchema)

module.exports = AddFriend