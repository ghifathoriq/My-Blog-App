const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

// create post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
});

// update
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "internal server error" });
      }
    } else {
      res.status(401).json({ msg: "you can update only your post" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
});

// delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.username === req.body.username) {
      try {
        await post.deleteOne();
        res.status(200).json({ msg: "post has been deleted" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "internal server error" });
      }
    } else {
      res.status(401).json({ msg: "you can delete only your post" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
});

// get post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
  }
});

// get all post
router.get("/", async (req, res) => {
  // karena ini akan menampilkan semua post yg ada diu db maka harus di validasi
  const username = req.query.user;
  const catName = req.query.cat;

  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
