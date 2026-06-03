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
    limit: '100mb',
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    },
}))
app.use(express.urlencoded({ limit: '100mb', extended: true }));
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

import nodemailer from 'nodemailer';

// Server start hote hi connection verify karne ke liye:
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

transporter.verify(function (error, success) {
    if (error) {
        console.log("❌ SMTP Connection Error:", error);
    } else {
        console.log("🚀 SMTP Server is ready to take our messages!");
    }
});

// Only start the server if we are NOT on Vercel
if (process.env.NODE_ENV !== 'PRODUCTION') {
  const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port: ${process.env.PORT || 3000}  in ${process.env.NODE_ENV} mode`);
  });
  server.timeout = 600000;
}


//handle unhandled promise rejections
process.on("unhandledRejection",(err)=>{
    console.log(`ERROR: ${err}`);
    console.log("shutting down server due to unhandled promise rejections");
    server.close(()=>{
        process.exit(1)
    })
})
 
export default app;