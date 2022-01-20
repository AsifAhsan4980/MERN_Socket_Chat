const Message = require("../models/Messages");
const ErrorResponse = require("../utils/errorResponse");

exports.saveMessage = async (req, res, next) => {
    try {
        const {chatIds, messageBody, time} = req.body
        const conId = req.params.id
        const data = await Message.find({"chatId": {$all: chatIds}})

        await Message.findByIdAndUpdate(data[0]._id, { $push: { messages: {conversationId: conId, message: messageBody, time: time}} })
        const response = await Message.find({"chatId": {$all: chatIds}})
        res.status(200).send(response)
    } catch (err) {
        return next(new ErrorResponse("Message couldn't save because " + err, 400));
    }
}

exports.getMessage = async (req, res, next) => {
    try {
        const {id1, id2} = req.query
        const data = await Message.find({"chatId": {$all: [id1, id2]}})
        res.status(201).send(data)
    } catch (err) {
        return next(new ErrorResponse("Message couldn't save because " + err, 400));
    }
}