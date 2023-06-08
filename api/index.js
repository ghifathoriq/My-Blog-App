const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postsRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");

// URL koneksi MongoDB
dotenv.config();

// Opsi koneksi
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Menghubungkan ke MongoDB
mongoose
  .connect(process.env.MONGO_URL, options)
  .then(() => {
    console.log("Terhubung ke MongoDB");
    // Lakukan operasi lain setelah terhubung ke database
  })
  .catch((err) => {
    console.error("Kesalahan saat terhubung ke MongoDB:", err);
  });
// -----------

// middle ware
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postsRoute);
app.use("/api/categories", categoryRoute);
// --------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    const filename = req.body.name;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), async (req, res) => {
  res.status(200).json("file has been uploaded");
});

app.listen("9000", () => {
  console.log("backend is runing..");
});
//
