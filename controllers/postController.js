const Post = require("../models/Post");
const User = require("../models/User");

const getPosts = async (req, res) => {
  try {
    const response = await Post.find().lean();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.messsage });
  }
};

const getPostById = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await Post.findById(id).lean();
    if (!response) return res.status(404).send("Id is not valid");
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    // const {userId} = req.userId;
    const { userId, username } = req.user;

    const { title, message, tag } = req.body;
    const file = req.files;
    const image = file.image.data;

    if (!title && !message && !tag && !image)
      return res.status(404).json({ message: "All fields are required" });

    const post = new Post({ userId, username, title, message, tag, image });
    let response = await post.save();
    response = response.toObject();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { userId, username } = req.user;
    const { id } = req.params;
    const { title, message, tag } = req.body;
    const file = req.files;
    const image = file.image.data;

    if (!id) return res.status(400).json({ message: "Id is required" });

    const post = await Post.findById(id, "userId");

    postUserId = post.userId.toString();
    if (postUserId !== userId)
      return res.status(409).json({ message: "user unauthirized" });

    if (!title && !message && !tag && !image)
      return res.status(404).json({ message: "All fields are required" });

    const response = await Post.findByIdAndUpdate(
      id,
      { userId, username, title, message, tag, image },
      { new: true }
    ).lean();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    if (!id) return res.status(404).json({ message: "Id is required" });

    const post = await Post.findById(id, "userId");
    postUserId = post.userId.toString();

    if (postUserId !== userId)
      return res.status(409).json({ message: "user unauthirized" });

    const response = await Post.findByIdAndDelete(id, { select: "id" }).lean();

    if (!response) return res.status(400).json({ message: "Id is not valid" });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Id is required" });

    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true, select: "likes id" }
    );

    if (!post) return res.status(400).json({ message: "Id is not valid" });

    res.status(200).json({ id: post._id, likes: post.likes });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
};
