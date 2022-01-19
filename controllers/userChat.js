const AddFriend = require("../models/AddFriend");
const User = require('../models/User')
const ErrorResponse = require("../utils/errorResponse");
const Message = require("../models/Messages");

const addDocument = async (userId) => {
    const data = await AddFriend.find({userId: userId})
    if (data.length === 0) {
        await AddFriend.create({
            userId,
            friends: [],
            requests: [],
            sentRequest: []
        });
    }
}

const addMessageDocument = async (sendersId, receiverId)=> {
    await Message.create({
        chatId : [sendersId, receiverId],
        messages: []
    })

}

// Friend Suggestion List
exports.suggestionList = async (req, res, next) => {
    const userId = req.params.id
    const friends = async () => {
        try {
            const userData = await AddFriend.find({userId: userId})
            if (userData.length !== 0) {
                let friendList = userData[0].friends
                let requestList = userData[0].requests
                let sentRequestList = userData[0].sentRequest
                let listOfId = []
                //add current User to filter
                listOfId.push(userId)
                //add current friends to filter
                for (let i = 0; i < friendList.length; i++) {
                    listOfId.push(friendList[i].friendId)
                }
                //add incoming request to filter
                for (let i = 0; i < requestList.length; i++) {
                    listOfId.push(requestList[i].friendId)
                }
                //add sent friend Request to filter
                for (let i = 0; i < sentRequestList.length; i++) {
                    listOfId.push(sentRequestList[i].friendId)
                }
                //filter list
                let addFriends = await User.find({_id: {$nin: listOfId}})
                res.status(200).send(addFriends)
            } else {
                await addDocument(userId)
                await friends()
            }
        } catch (err) {
            return next(new ErrorResponse("Something went wrong in suggestionList " + err, 400));
        }
    }
    await friends()
}

//add Friend from request
exports.requestFriends = async (req, res, next) => {
    try {
        const senderId = req.params.id
        const receiverId = req.body.friendId
        console.log(req.body)
        const receiverData = await AddFriend.find({userId: receiverId})
        const senderData = await AddFriend.find({userId: senderId})
        let insert = false

        if (receiverData.length !== 0 && receiverData[0].requests !== undefined) {
            if (receiverData[0].requests.length === 0) {
                insert = true
            } else {
                for (let i = 0; i < receiverData[0].requests.length; i++) {
                    if (req.body.friendId !== undefined) {
                        if (receiverData[0].requests[i].friendId !== senderId) {
                            insert = true
                        } else {
                            insert = false
                            break
                        }
                    }

                }
            }
        }
        if (insert) {

            // const sentRequest = senderData[0].sentRequest
            // sentRequest.push(receiverId)
            // console.log(sentRequest)

            await AddFriend.updateOne({_id:senderData[0]._id}, { $push: { sentRequest: req.body } })
            await AddFriend.updateOne({_id:receiverData[0]._id}, { $push: {requests : {'friendId': req.params.id} }})
            // receiverData[0].requests.push(senderId)
            // senderData[0].sentRequest.push(receiverId)
            // console.log(receiverData[0].requests)
            // await receiverData[0].save()
            // await senderData[0].save()
        }
        res.status(200).send({message:'friend request sent'})
    } catch (err) {
        return next(new ErrorResponse("Something went wrong in requestFriends" + err, 400));
    }
}

// Friend Request List
exports.requestList = async (req, res, next) => {
    const userId = req.params.id
    const friends = async () => {
        try {
            const userData = await AddFriend.find({userId: userId})
            if (userData.length !== 0) {
                let friendList = userData[0].requests
                let listOfId = []
                //add request list
                for (let i = 0; i < friendList.length; i++) {
                    listOfId.push(friendList[i].friendId)
                }
                //filter
                let addFriends = await User.find({_id: {$in: listOfId}})
                res.status(200).send(addFriends)
            } else {
                // await addDocument(userId)
                await friends()
            }
        } catch (err) {
            return next(new ErrorResponse("Something went wrong in get request " + err, 400));
        }

    }
    await friends();
}

//Accept Friend  Request
exports.acceptFriends = async (req, res, next) => {
    try {
        //retrieve Ids
        const receiverID = req.params.id
        const senderID = req.body.friendId

        //retrieve data
        const senderData = await AddFriend.find({userId: senderID})
        const receiverData = await AddFriend.find({userId: receiverID})

        //filter: pop ids
        const filterReceiverData = receiverData[0].requests.filter((data) => data.friendId !== senderID)
        const filterSenderData = senderData[0].sentRequest.filter((data) => data.friendId !== receiverID)

        //update new array to database
        await AddFriend.findByIdAndUpdate( senderData[0]._id, {sentRequest:filterSenderData})
        await AddFriend.findByIdAndUpdate( receiverData[0]._id, {requests:filterReceiverData})

        //push friend id to sender and receiver
        await AddFriend.updateOne({_id:senderData[0]._id}, { $push: { friends: {'friendId': req.params.id}} })
        await AddFriend.updateOne({_id:receiverData[0]._id}, { $push: { friends:  req.body }})

        //Create Message Document
        await addMessageDocument(senderID, receiverID)


        console.log(senderData[0].sentRequest)
    } catch (err) {
        return next(new ErrorResponse("Something went wrong in acceptFriends" + err, 400));
    }
}


// Friend List
exports.friendList = async (req, res, next) => {
    const userId = req.params.id
    const friends = async () => {
        try {
            const userData = await AddFriend.find({userId: userId})
            if (userData.length !== 0) {
                let friendList = userData[0].friends
                let listOfId = []
                //add request list
                for (let i = 0; i < friendList.length; i++) {
                    listOfId.push(friendList[i].friendId)
                }
                //filter
                let addFriends = await User.find({_id: {$in: listOfId}})
                res.status(200).send(addFriends)
            } else {
                // await addDocument(userId)
                await friends()
            }
        } catch (err) {
            return next(new ErrorResponse("Something went wrong in get request " + err, 400));
        }

    }
    await friends();
}