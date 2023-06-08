const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// register
router.post("/register", async (req, res) => {
  try {
    // process hashing password new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    // save the user reg
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error while connect to db" });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    // Cari pengguna berdasarkan username
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      // Jika username tidak ditemukan
      return res.status(401).json({ message: "Wrong credentialsU" });
    }

    // Memvalidasi kata sandi
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      // Jika password tidak cocok
      return res.status(401).json({ message: "Wrong credentialsP" });
    }
    // menyembunyikan retrun password ke user
    const { password, ...others } = user._doc;

    // jika ingin mereturn password ke user hapus variabel di atas dan ganti resstatus json(user)

    // Jika keduanya cocok, login berhasil
    return res.status(200).json(others);
  } catch (err) {
    // Penanganan kesalahan lainnya
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
