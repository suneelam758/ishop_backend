const express = require('express');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const UserModel = mongoose.model("UserModel");
const AdminModel = mongoose.model("AdminModel")
const { JWT_SECRET } = require('../config');
const protectedRoute = require("../middleware/protectedResource");

router.post("/signup", (req, res) => {
    const { fullName, email, password, profileImg } = req.body;
    if (!fullName || !password || !email) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
    UserModel.findOne({ email: email })
        .then((userInDB) => {
            if (userInDB) {
                return res.status(500).json({ error: "User with this email already registered" });
            }
            bcryptjs.hash(password, 16)
                .then((hashedPassword) => {
                    const user = new UserModel({ fullName, email, password: hashedPassword, profileImg });
                    user.save()
                        .then((newUser) => {
                            res.status(201).json({ result: "User Signed up Successfully!" });
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }).catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!password || !email) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
    UserModel.findOne({ email: email })
        .then((userInDB) => {
            if (!userInDB) {
                return res.status(401).json({ error: "Invalid Credentials" });
            }
            bcryptjs.compare(password, userInDB.password)
                .then((didMatch) => {
                    if (didMatch) {
                        const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET);
                        const userInfo = { "_id": userInDB._id, "email": userInDB.email, "fullName": userInDB.fullName };
                        res.status(200).json({ result: { token: jwtToken, user: userInfo } });
                    } else {
                        return res.status(401).json({ error: "Invalid Credentials" });
                    }
                }).catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
});

//get user profile 

//all user logged in info
router.get("/getuser", protectedRoute, (req, res) => {
    UserModel.find({ _id: req.user._id },{Adminsts:1,AffiliateStatus:1,Shop:1,address:1,contact:1,email:1,fullName:1,gender:1,profileImg:1,_id:1})
        .then((dbPosts) => {
            res.status(200).json({ posts: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

//update user info api 
router.post("/updateuser", protectedRoute, (req, res) => {
    let id = req.user._id;
    UserModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `error in updating the record`
                });
            } else res.status(201).send({ message: "Updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error in updating"
            });
        });

})

//update user info api 
router.post("/affiliatepartner", protectedRoute, (req, res) => {
    let id = req.user._id;
    let successmessage = '';
    if (req.body.AffiliateStatus == 1) {
        successmessage = 'Details updated successfully!!'
    } else {
        successmessage = 'Congrats you are now our affiliate partner'
    }
    UserModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `error in updating the record`
                });
            } else res.status(201).send({ message: successmessage });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error in updating"
            });
        });

})


//update password api
router.post("/updatepassword", (req, res) => {
    const { email, password } = req.body;
    if (!password || !email) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
    UserModel.findOne({ email: email })
        .then((userInDB) => {
            if (!userInDB) {
                return res.status(401).json({ error: "Email id not found" });
            }
            bcryptjs.hash(password, 16)
                .then((hashedPassword) => {
                    UserModel.updateOne(
                        { email: email },
                        {
                            $set: {
                                password: hashedPassword
                            }
                        }
                    ).then(() => {
                        res.status(201).send({ message: 'Password updated successfully!!' });
                    })

                })
        })
        .catch((err) => {
            console.log(err);
        })
});


//admin signup
router.post("/adminsignup", (req, res) => {
    const { fullName, email, password,profileImg } = req.body;
    if (!fullName || !password || !email) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
    AdminModel.findOne({ email: email })
        .then((userInDB) => {
            if (userInDB) {
                return res.status(500).json({ error: "Admin with this email already registered" });
            }
            bcryptjs.hash(password, 16)
                .then((hashedPassword) => {
                    const user = new AdminModel({ fullName, email, password: hashedPassword });
                    user.save()
                        .then((newUser) => {
                            const user = new UserModel({ fullName, email, password: hashedPassword, profileImg });
                            user.save()
                                .then((newUser) => {
                                    res.status(201).json({ result: "Admin Signed up Successfully!" });
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }).catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
});

//admin login 
router.post("/adminlogin", (req, res) => {
    const { email, password } = req.body;
    if (!password || !email) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
    AdminModel.findOne({ email: email })
        .then((userInDB) => {
            if (!userInDB) {
                return res.status(401).json({ error: "Invalid Credentials" });
            }
            bcryptjs.compare(password, userInDB.password)
                .then((didMatch) => {
                    if (didMatch) {
                        const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET);
                        const userInfo = { "_id": userInDB._id, "email": userInDB.email, "fullName": userInDB.fullName };
                        res.status(200).json({ result: { token: jwtToken, user: userInfo } });
                    } else {
                        return res.status(401).json({ error: "Invalid Credentials" });
                    }
                }).catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
});

//all users
router.get("/getallusers", protectedRoute, (req, res) => {
    UserModel.find({})
        .then((dbPosts) => {
            res.status(200).json({ posts: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

//get user by id
router.get("/getuserbyid/:id", protectedRoute, (req, res) => {
    UserModel.find({ _id: req.params.id })
        .then((dbPosts) => {
            res.status(200).json({ posts: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});


//update user by  admin 
router.post("/edituser/:id", protectedRoute, (req, res) => {
    let id = req.params.id;
    // console.log(id);return;
    UserModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `error in updating the record`
                });
            } else res.status(201).send({ message: "Updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error in updating"
            });
        });

})

//remove user from database access only by admin 
router.get("/removeuser/:id", protectedRoute, (req, res) => {
    let deleteid = req.params.id
    UserModel.deleteOne({ _id: deleteid })
        .then((dbPosts) => {
            res.status(200).json({ items: dbPosts, message:'User removed successfully!!' })
        })
        .catch((error) => {
            console.log(error);
        })
});


module.exports = router;