const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const authRouter = require("./modules/auth/auth.route")
const categoryRouter = require("./modules/category/category.route");
const collectionRouter = require("./modules/collection/collection.route");
const colorRouter = require("./modules/color/color.route");
const sizeRouter = require("./modules/size/size.route");
const productRouter = require("./modules/product/product.route");
const productVariantRouter = require("./modules/product-variant/productVariant.route");
const productImageRouter = require("./modules/product-image/productImage.route");
const wishlistRouter = require("./modules/wishlist/wishlist.route");
const cartRouter = require("./modules/cart/cart.route");
const orderRouter = require("./modules/order/order.route");
const uploadRouter = require("./modules/upload/upload.route");
const aiTryOnRouter = require("./modules/ai-try-on/aiTryOn.route");
const userRouter = require("./modules/user/user.route");
const notFoundMiddleware = require("./middlewares/notFound.middleware");
const errorMiddleware = require("./middlewares/error.middleware");
const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(cors());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(apiLimiter);
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/collections", collectionRouter);
app.use("/api/colors", colorRouter);
app.use("/api/sizes", sizeRouter);
app.use("/api/products", productRouter);
app.use("/api/product-variants", productVariantRouter);
app.use("/api/product-images", productImageRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/ai-try-on", aiTryOnRouter);
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MONO Backend API is running.",
  });
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;


