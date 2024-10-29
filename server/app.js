import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./middelware/globleErrHandler.js";
import morgan from "morgan";
import authRoutes from "./routes/User.routes.js"
import productRoutes from "./routes/Product.routes.js"
import CartRoutes from "./routes/Cart.routes.js"
import orderrouters from "./routes/Order.routes.js"
const app = express();


// Middleware Setup
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use("/api/v1/auth", authRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/cart', CartRoutes);
app.use('/api/v1/order', orderrouters);

// Root Route
app.get("/", (req, res) => {
    res.send({
        success: true,
        message: "Server is UP and LIVE 🔥🔥"
    });
});

// Global Error Handler
app.use(globalErrorHandler);

export { app };