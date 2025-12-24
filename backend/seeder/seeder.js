import dotenv from "dotenv";
dotenv.config({ path: "backend/config/config.env" });

import Product from "../models/product.js";
import Products from "./data.js"
import connectDb  from "../config/dbConnect.js";
 


const seedProducts = async () => {
    try {
        await connectDb();

        await Product.deleteMany();
        console.log("Products are delelted");

        await Product.insertMany(Products);
        console.log("Peoducts are added")
        process.exit(0);

    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}
seedProducts();