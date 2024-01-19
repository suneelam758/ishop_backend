const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const BrandModel = mongoose.model("BrandModel");

// add brand api {This API does not hit by frontend  it can be hit by using postman}
router.post("/addbrand", (req, res) => {
    const { Name,Category} = req.body;
    if (!Name || !Category) {
        return res.status(400).json({ error: "Name is required" });
    }
    
                    const items = new BrandModel({ Name,Category });
                    items.save()
                        .then(() => {
                            res.status(201).json({ result: "Brand added Successfully!" });
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                
        .catch((err) => {
            console.log(err);
        })
});

//all brands  by product items 
router.get("/getallbrands/list/:id", (req, res) => {
    
    BrandModel.find({Category:req.params.id}).limit(10)
        .then((dbPosts) => {
            res.status(200).json({ items: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});
//all brands api 
router.get("/getallbrandlist", (req, res) => {
    
    BrandModel.find({})
        .then((dbPosts) => {
            res.status(200).json({ items: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});


module.exports = router;