const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const productRoute = require("./routes/products");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");
const Stripe = require("stripe");
const stripeRouter = require("./routes/stripe");
const port = 3000;
dotenv.config();
const stripe = Stripe(process.env.STRIPE_SECRET);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));
app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.options("*", cors());

app.use("/api/", authRoute);
app.use("/api/products", productRoute);
app.use("/api/users", userRoute);
app.use("/api/orders", orderRoute);
app.use("/api/cart", cartRoute);

app.listen(process.env.PORT || port, () =>
  console.log(`Example app listening on port ${process.env.PORT} || ${port}!`)
);
