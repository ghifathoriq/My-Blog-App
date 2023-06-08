const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Post = require("../models/Post");

// update
router.put("/:id", async (req, res) => {
  // if (req.body.userId === req.params.id) {
  //   if (req.body.password) {
  //     const salt = await bcrypt.genSalt(10);
  //     req.body.password = await bcrypt.hash(req.body.password, salt);
  //   }
  //   try {
  //     const updatedUser = await User.findByIdAndUpdate(req.params.id, {
  //       $set: req.body
  //     });
  //     res.status(200).json(updatedUser);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ msg: "error while connect to db" });
  //   }
  // } else {
  //   res.status(401).json({ message: "you can update only your account!" });
  // }
  const { userId, password } = req.body;
  const { id } = req.params;

  if (userId !== id) {
    return res
      .status(401)
      .json({ message: "You can update only your account!" });
  }

  try {
    if (password) {
      req.body.password = await hashPassword(password);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while connecting to the database" });
  }
});

async function hashPassword(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

// delete
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      // find the user
      const user = await User.findById(req.params.id);
      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("user has been deleted...");
      } catch (error) {
        console.error(error);
        res.status(500).json(error);
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({ msg: "user not found" });
    }
  } else {
    return res
      .status(500)
      .json({ message: "Error while connecting to the database" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
