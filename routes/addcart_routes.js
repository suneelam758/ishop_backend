const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const AddCartModel = mongoose.model("AddCartModel");
const ProductModel = mongoose.model("ProductModel");
const StateModel = mongoose.model("StateModel")
const OrderHistoryModel = mongoose.model("OrderHistoryModel")
const { JWT_SECRET } = require('../config');
const protectedRoute = require("../middleware/protectedResource");

//add to cart  api
router.post("/addtocart", protectedRoute, (req, res) => {
    const { ProductId } = req.body;
    let CustomerId = req.user._id
    let DateOrder = new Date();
    if (!ProductId) {
        return res.status(500).json({ error: "product not added" });
    }
    AddCartModel.findOne({ ProductId: ProductId, OrderStatus: 0,CustomerId:req.user._id })
        .then((userInDB) => {
            if (userInDB) {
                return res.send({ error: "Item already added" });
            }
            const postObj = new AddCartModel({ ProductId, CustomerId, DateOrder });
            postObj.save()
                .then(() => {
                    res.status(201).json({ success: "Item added successfully!!" });
                })
                .catch((error) => {
                    console.log(error);
                })
        }).catch((err) => {
            console.log(err);
        })
});

//get gettotalorders
router.get("/gettotalorders/:id", protectedRoute, (req, res) => {
    let status = req.params.id;
    AddCartModel.find({ CustomerId: req.user._id, OrderStatus: status })
        .then((dbPosts) => {
            res.status(200).json({ items: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

//get sizefiltered value 
router.post("/getCartItems", (req, res) => {
    let cartarr = req.body;
    let recart = [];
    cartarr.forEach(element => {
        recart.push(element.ProductId)
    });
    ProductModel.find({ _id: { $in: recart } })
        .then((dbPosts) => {
            res.status(200).json({ items: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

//remove from cart api 
router.get("/removecart/:id", protectedRoute, (req, res) => {
    let deleteid = req.params.id
    AddCartModel.deleteOne({ ProductId: deleteid })
        .then((dbPosts) => {
            res.status(200).json({ items: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

// indian state add api
router.post("/addstate", (req, res) => {
    const { Name } = req.body;
    const items = new StateModel({ Name });
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

//get all states 
router.get("/getallstates", (req, res) => {
    StateModel.find()
        .then((dbPosts) => {
            res.status(200).json({ items: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

//order history api
router.post("/orderhistory", protectedRoute, async (req, res) => {
    let OrderDetail = req.body;
    // console.log(OrderDetail[2]);return;
    let DateOrder = new Date()
    for (let i = 0; i < OrderDetail[1].length; i++) {
        AddCartModel.updateOne(
            { _id: OrderDetail[1][i]._id },
            {
                $set: {
                    DateOrder: DateOrder,
                    OrderStatus: 1,
                    Quantity: OrderDetail[0][i],
                    CustomerInfo:OrderDetail[2]
                }
            }
        ).then(() => {
            if (i == OrderDetail[1].length - 1) {
            const items = new OrderHistoryModel({ CustomerName:OrderDetail[2].name , AddressLine1:OrderDetail[2].add1, AddressLine2:OrderDetail[2].add2, State:OrderDetail[2].OrderState, City:OrderDetail[2].Ccity,PinCode:OrderDetail[2].Pincode, CustomerId : req.user._id, OwnerArray:OrderDetail[2].owner});
            items.save()
            }

        }).then(async () => {
            const projection = {
                Quantity: 1, // 1 indicates inclusion
                _id: 0, // Excluding the _id field, if needed
            };
            const result = await ProductModel.find({ _id: OrderDetail[1][i].ProductId }, projection)
            let totalQuantity = Number(result[0].Quantity)
            let quant = { Quantity: totalQuantity - Number(OrderDetail[0][i]) }
            ProductModel.findByIdAndUpdate(OrderDetail[1][i].ProductId, quant, { useFindAndModify: false })
                .then(data => {
                    if (!data) {
                        if (i == OrderDetail[1].length - 1) {
                            res.status(404).send({
                                message: `error in updating the record`
                            });
                        } else {
                            return;
                        }

                    } else {
                        if (i == OrderDetail[1].length - 1) {
                            res.status(201).send({ message: "Ordered successfully." });
                        } else {
                            return;
                        }

                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Error in updating"
                    });
                });
        })


    }
});

// get details
router.get("/getiteminfo/:id", protectedRoute, (req, res) => {
    let id = req.params.id;
    AddCartModel.find(
        {
            $and: [
                { ProductId: id },
                { CustomerId: req.user._id }
            ]
        }
        
        )
        .then((dbPosts) => {
            res.status(200).json({ items: dbPosts })
        })
        .catch((error) => {
            console.log(error);
        })
});

// get sold products
router.get("/getsoldproducts", protectedRoute, (req, res) => {
    let Userid = req.user._id;
    AddCartModel.find()
        .then((dbPosts) => {
            let Productdis = []
            for(let i=0 ; i<dbPosts.length;i++){
                Productdis.push(dbPosts[i].ProductId)
            }
            ProductModel.find({ _id: { $in: Productdis }, Owner:Userid })
            .then((Solditems) => {
                let allSold = [];
                for(let n=0;n<Solditems.length;n++){
                    for(let m = 0; m< dbPosts.length ; m++){
                        if(dbPosts[m].ProductId == Solditems[n]._id)
                            allSold.push(dbPosts[m])
                    }
                }
                res.status(200).json({ items: Solditems, itemData:allSold })
            })
        })
        .catch((error) => {
            console.log(error);
        })
});

//delete item
router.delete("/ishop/:id/delete", protectedRoute, (req, res) => {
    let deleteid = req.params.id
    ProductModel.deleteOne({ _id: deleteid })
        .then((dbPosts) => {
            res.status(200).json({message:'Product deleted successfully!!' })
        })
        .catch((error) => {
            console.log(error);
        })
});

//mark out of stock
router.get("/ishop/:id/outofstock", protectedRoute, (req, res) => {
    let updateid = req.params.id
    let quantity = {Quantity:0}
    ProductModel.findByIdAndUpdate(updateid,quantity , { useFindAndModify: false })
        .then((dbPosts) => {
            res.status(200).json({message:'Out of Stock!!' })
        })
        .catch((error) => {
            console.log(error);
        })
});

module.exports = router;