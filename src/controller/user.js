const userModel = require('../model/user');
const {  removeFieldsProject, removeFieldsFind } = require('../utils/reusableFunctions');
const multer = require('multer');

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

exports.getPassword = async (req, res) => {
    let permissions= req.user.role.permissions
    let project = `email ${permissions.includes('getpassd')?'password':''}`;
    
    

    try {
        let user = await userModel.findOne({_id:req.user._id}, project);
        res.send({ message: "getpass", data: user });
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

exports.editImage = async (req, res) => {
    try {
        const imagePath = req.file.path; // المسار المحلي للصورة
        
        // تحديث بيانات المستخدم وإضافة رابط الصورة
        const user = await userModel.updateOne({_id:req.user._id}, { profileImage: imagePath });
    
        res.json({ success: true, message: 'تم رفع الصورة بنجاح' });
      } catch (error) {
        res.status(500).json({ success: false, message: 'حدث خطأ أثناء رفع الصورة', error });
      }
};


