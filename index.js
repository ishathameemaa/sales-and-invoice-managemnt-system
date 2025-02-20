const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const adminRoutes = require("./routes/admin.route.js");
// const cors = require("cors");
const productRoutes = require("./routes/product.route.js");
const customerRoutes = require('./routes/customerRoutes.js');
const invoiceRoute = require("./routes/one.invoiceRoutes.js");
// require("./controllers/invoiceController.js")
const  invoiceRoutes = require('./routes/invoices.routes.js')



dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "25mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
// app.use(cors({
//   origin: "http://localhost:5173", 
//   credentials: true,
// }));



// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
  
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use('/api/customer', customerRoutes)
app.use("/api/invoices", invoiceRoute);
app.use("/api/invo", invoiceRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Server is running! Welcome to the API.");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
