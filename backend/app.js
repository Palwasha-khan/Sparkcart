import express from 'express'
const app = express()
import dotenv from 'dotenv'
import connectDb from "./config/dbConnect.js"
import errorMiddleware from "./middleware/error.js"
import cookieParser from 'cookie-parser'

//handle uncaught exception
process.on("uncaughtException", (err) =>{
    console.log(`ERROR: ${err}`);
    console.log("shutting down server due to unhandled expections");
    process.exit(1)
})

dotenv.config({ path: "backend/config/config.env"});

//connect database
connectDb();

app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    },
}))
app.use(cookieParser())

//import all routes

import productRoutes from "./routes/products.js"
import authRoutes from "./routes/auth.js"
import orderRoutes from "./routes/order.js" 
import paymentRoutes from "./routes/payment.js" 

app.use("/api/v1",productRoutes)
app.use("/api/v1",authRoutes)
app.use("/api/v1",orderRoutes)
app.use("/api/v1",paymentRoutes)

//using error middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT,()=>{
    console.log(`server started on port : ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

//handle unhandled promise rejections
process.on("unhandledRejection",(err)=>{
    console.log(`ERROR: ${err}`);
    console.log("shutting down server due to unhandled promise rejections");
    server.close(()=>{
        process.exit(1)
    })
})