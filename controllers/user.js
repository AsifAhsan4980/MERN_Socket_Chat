const User = require("../models/User");

exports.getOneUser = async (req, res) => {
    const id = req.params.id
    if (id) {
        User.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found food with id " + id })
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Error retrieving user with id " + id + err })
            })
    }
};

exports.getAllUserExceptCurrent = async (req, res) => {
    const id = req.params.id
    if (id) {
        User.find({_id : {$ne: id}})
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found food with id " + id })
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Error retrieving user with id " + id + err })
            })
    }
};