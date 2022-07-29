const express = require("express");
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const userRoute = require("./routes/user")
const authRoute = require("./routes/authentication")
const prodRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
dotenv.config();

mongoose.connect(process.env.DB_URL).then(() => console.log("DBConnection Successful!"))
.catch((err) => {
    console.log(err)
})

//to pass any json file 
app.use(express.json())
//
app.use("/api/authentication", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", prodRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute); 

app.get("/api/test", () => {
    console.log("Tests a success!")
})
app.listen(process.env.PORT || 5000, () => {
    console.log("Backend runs!")
})