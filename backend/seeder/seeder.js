import mongoose from "mongoose";
import Product from "../models/product.js";
import products from "./data.js"
import connectDb  from "../config/dbConnect.js";

const seedProducts = async () => {
    try {
        await connectDb();

        await Product.deleteMany();
        console.log("Products are delelted");

        await Product.insertMany(products);
        console.log("Peoducts are added")
        process.exit(0);

    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}
seedProducts();