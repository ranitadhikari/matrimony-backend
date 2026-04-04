const express = require("express");
const cors = require("cors");
const { connect } = require("./config/db");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ✅ correct route usage
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/interests", require("./routes/interestRoutes"));
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await connect();
    console.log("✅ DB connected");
  } catch (error) {
    console.error("❌ DB connection failed:", error);
  }

  console.log(`🚀 Server is listening on port ${PORT}`);
});