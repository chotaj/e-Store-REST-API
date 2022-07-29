const Customer = require("../models/Customer")
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");


const router = require("express").Router();

router.put("/:id", verifyTokenAndAuthorization, async (req,res)=> {
    if(req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET_CODE
        ).toString()
    }
    try {
        const updatedUser = await Customer.findByIdAndUpdate(req.params.id, {
            $set:req.body
        }, {new:true})
        res.status(200).json(updatedUser)
    } catch (err) {
        res.status(500).json(err);
    }
})

router.delete("/:id", verifyTokenAndAuthorization, async (req,res) => {
    try {
        await User.findByIdAndDelete(req.params.id) 
        res.status(200).json("User is deleted")
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get("/find/:id", verifyTokenAndAdmin, async (req,res) => {
    try {
        const user = await Customer.findById(req.params.id) 
        const { password, ... others} = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get("/", verifyTokenAndAdmin, async (req,res) => {
    const query = req.query.new
    try {
        const users = query? await Customer.find().sort({_id: -1}).limit(1) : await User.find()
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err)
    }
})
module.exports = router 