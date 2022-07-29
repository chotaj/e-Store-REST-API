const router = require("express").Router(); 
const Customer =  require("../models/Customer");
const Crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const { verifyTokenAndAdmin } = require("./verifyToken");

router.post("/register", async (req,res) => {
    const newCustomer = new Customer({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_CODE).toString(),
    });

    if (newCustomer.username === null || newCustomer.email === null 
        || newCustomer.password === null) {
            res.status(400).json("Please fill out username, email, and password!");
        }

    try {
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer)
    } catch (err) {
    res.status(500).json(err);
    }

});

router.post("/login", async (req,res) => {
    try {
        const customer = await Customer.findOne({username: req.body.username})
        
        !customer && res.status(401).json("Wrong credentials :(")
        
        const hashedSecCode = CryptoJS.AES.decrypt(customer.password, process.env.SECRET_CODE)
        const passcode = hashedSecCode.toString(CryptoJS.enc.Utf8);
        
        passcode !== req.body.password && 
        res.status(401).json("Wrong credentials :(")
        
        //if everything is ok...
        const accessToken = jwt.sign({
            id:user._id, 
            isAdmin: user.isAdmin,
        }, process.env.JWT_CODE,
        {expiresIn:"2d"}
        )
        const { password, ... others} = customer._doc;

        res.status(200).json({...others, accessToken});
    } catch (err) {
        res.status(500).json("There's a problem, refresh the page and try again")
    }
})

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear - 1))
    try {
        const data = await User.aggregate([
            {$match: { createdAt: { $gte: lastYear}}}, 
            {
                $project: {
                    month: {$month: "$createdAt"},
                }
            },
            {
                $group: {
                    _id: "$month",
                    total:{$sum: 1},
                }
            }
        ])
        res.status(200).json(data)
    } catch(err) {
        res.status(500).json(err)
    }
})
module.exports = router; 