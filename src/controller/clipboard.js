const Clipboard = require("../model/clipboard");

exports.createClipboard = async (req, res) => {
    try {
        req.body.user = req.user._id;
        const filePath = req.file?.path||req.file?.location
        req.body.content = filePath||req.body.content; // المسار المحلي للصورة
        let clipboard = await Clipboard.create(req.body);
        res.send({ message: "clipboard created", data: clipboard });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};
exports.getAllClipboard = async (req, res) => {
    try {
        let userId = req.user._id;
        let clipboards = await Clipboard.find({user:userId});
        res.send({ message: "all clipboards", data: clipboards });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

exports.deleteClipboard = async (req, res) => {
    try {
        
        let clipboards = await Clipboard.deleteOne({_id:req.body._id});
        res.send({ message: "deleted", data: clipboards });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

