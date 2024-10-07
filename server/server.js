const express = require("express");
const morgan = require('morgan');
const app = express();
const cors = require("cors");
const { mongodb } = require("./config");

const adminUserRoute = require('./src/routes/adminUser.route');
const unitRouter = require('./src/routes/unit.route');
const productRouter = require('./src/routes/product.route');
const customerRouter = require("./src/routes/customer.route");
const orderRouter = require("./src/routes/order.route");
const statusRouter = require("./src/routes/status.route");
const shopRouter = require("./src/routes/shop.route");

// const corsOptions = {
//     origin: ["http://localhost:3000/", "http://192.168.1.15:3000/"]
// }

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());
app.use(morgan('dev'));

// 
app.use("/api/adminuser", adminUserRoute);
app.use("/api/unit", unitRouter);
app.use("/api/product", productRouter);
app.use("/api/customer", customerRouter);
app.use("/api/order", orderRouter);
app.use("/api/status", statusRouter);
app.use("/api/shop", shopRouter);


app.get("/", (req,res) => {
    res.send("Api is Working!!");
});

const PORT = process.env.PORT || 8090;

mongodb.connect().then(() => {
    try{
        console.log("Connect to database");
        app.listen(PORT, () => {
            console.log(`app is listen on port ${PORT}`);
        })
    }catch(error) {
        console.error(`Error starting server: ${error}`);
    }
}).catch((error)=> {
    console.log(`Error connecting to MongoDB: ${error}`);
})

