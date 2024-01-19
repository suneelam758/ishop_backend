const express = require('express');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const ProductModel = mongoose.model("ProductModel");
const { JWT_SECRET } = require('../config');
const protectedRoute = require("../middleware/protectedResource");
const path = require('path');

router.post("/postitem",protectedRoute, (req, res) => {
    let Owner = req.user._id
    const { ItemName, Price, Description, Image, Category, Quantity,subcategory, Size,Brand } = req.body;
    if (!ItemName || !Price || !Description || !Image) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }

    const items = new ProductModel({ ItemName, Price, Description, Image, Category, subcategory, Quantity, Size,Brand,Owner });
    items.save()
        .then(() => {
            res.status(201).json({ result: "item added Successfully!" });
        })
        .catch((err) => {
            console.log(err);
        })

        .catch((err) => {
            console.log(err);
        })
});

//all homecover items 
router.get("/getallhomelists", (req, res) => {
    ProductModel.find().limit(10)
        .then((dbPosts) => {
            res.status(200).json({ items: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});


//get all selling items 
router.post("/getallproducts", (req, res) => {
    ProductModel.find().limit(req.body.limit)
        .then((dbPosts) => {
            res.status(200).json({ items: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

//get search items
router.get("/searchproducts/:id", (req, res) => {
    let searchvalue = req.params.id;
    ProductModel.find({$or:[{ ItemName: { $regex: searchvalue, $options: 'i' }},{ Category: { $regex: searchvalue, $options: 'i' }},{ subcategory: { $regex: searchvalue, $options: 'i' }},{ Brand: { $regex: searchvalue, $options: 'i' }}]})
        .then((dbPosts) => {
            res.status(200).json({ items: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});
//get category selling items 
router.get("/getcategoryproducts/:value", (req, res) => {
    // console.log(req.params);
    ProductModel.find({ Category: req.params.value })
        .then((dbPosts) => {
            res.status(200).json({ items: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});
//get subcategory selling items 
router.get("/getsubcategoryproducts/:value/:id", (req, res) => {
    // console.log(req.params);
    ProductModel.find({ subcategory: req.params.value, Category: req.params.id })
        .then((dbPosts) => {
            res.status(200).json({ items: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

//get filtered value 
router.post("/getfiltervalue/:id", (req, res) => {
    ProductModel.find({ Brand: { $in: req.body }, Category: req.params.id })
        .then((dbPosts) => {
            res.status(200).json({ items: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});
//get sizefiltered value 
router.post("/getsizefiltervalue/:id", (req, res) => {
    ProductModel.find({ Size: { $in: req.body }, Category: req.params.id })
        .then((dbPosts) => {
            res.status(200).json({ items: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});
//get prizefiltered value 
router.post("/getprizefiltervalue/:id", (req, res) => {
    const minprice = req.body[0]
    const maxprice = req.body[1]
    // ProductModel.find({Price:  req.body ,Category:req.params.id})
    ProductModel.find({
        $and: [
            { Price: { $gt: minprice, $lt: maxprice } },
            { Category: req.params.id }
        ]
    })
        .then((dbPosts) => {
            res.status(200).json({ items: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

//get product by Id
router.get("/getproductinfo/:id", (req, res) => {
    ProductModel.find({ _id: req.params.id })
        .then((dbPosts) => {
            res.status(200).json({ items: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

//get products by owner
router.get("/getyourproducts", protectedRoute,(req, res) => {
    ProductModel.find({ Owner: req.user._id})
        .then((dbPosts) => {
            res.status(200).json({ items: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

//update product
//update user info api 
router.post("/updateitem/:id",protectedRoute, (req,res)=>{
    let id = req.params.id;
        ProductModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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



module.exports = router;