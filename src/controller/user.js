const userModel = require('../model/user');
const {  removeFieldsProject, removeFieldsFind } = require('../utils/reusableFunctions');

exports.options =async (req, res, err) => {
    res.send({
        message: "user document",
        data: [
            {
                url: "/api/users",
                verb: "GET",
                description: "Get all users"
            },
            {
                url: "/api/users/:id",
                verb: "GET",
                description: "Get a user by id"
            },
            {
                url: "/api/users",
                verb: "POST",
                description: "Create a new user"
            }
        ]
    })
}
exports.create =async (req, res, err) => {
    let newUser = req.body
    try {
        let user =await userModel.create(newUser)
        res.send({message:"created",data:user})

    }catch(err) {res.send(err)}
}

exports.getOne = async (req, res) => {
    let project = removeFieldsProject(["password", "email"],req.body.project)
    let findObj = removeFieldsFind(["password", "email"],req.body)

    try {
        let user = await userModel.findOne(findObj, project);
        res.send({ message: "Retrieved", data: user });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};


exports.getall = async (req, res) => {
    let sortObj = req.body.sort 
    let project = removeFieldsProject(["password", "email"],req.body.project)
    let findObj = removeFieldsFind(["password", "email"],req.body)
    
    try {
        let user = await userModel.find(findObj, project).sort(sortObj);
        res.send({ message: "Retrieved", data: user });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

