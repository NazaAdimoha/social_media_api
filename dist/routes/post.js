"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_1 = __importDefault(require("../models/post"));
const user_1 = __importDefault(require("../models/user"));
// Create Post
router.post('/', async (req, res, next) => {
    const newPost = new post_1.default(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//Update a Post
router.put('/:id', async (req, res, next) => {
    try {
        const post = await post_1.default.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("the post has been updated");
        }
        else {
            res.status(403).json("you can update only your post");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});
// Delete Post
router.delete('/:id', async (req, res, next) => {
    try {
        const post = await post_1.default.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("the post has been deleted");
        }
        else {
            res.status(403).json("you can delete only your post");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//Like and dislike a post
router.put('/:id/likes', async (req, res, next) => {
    try {
        const post = await post_1.default.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("the post has been liked");
        }
        else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("the post has been disliked");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//get a post 
router.get('/:id', async (req, res, next) => {
    try {
        const post = await post_1.default.findById(req.params.id);
        res.status(200).json(post);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
// get timeline posts
router.get('/timeline/all', async (req, res, next) => {
    let postArray = [];
    try {
        const currentUser = await user_1.default.findById(req.body.userId);
        const userPosts = await post_1.default.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(currentUser.following.map((friendId) => {
            return post_1.default.find({ userId: friendId });
        }));
        res.json(userPosts.concat(...friendPosts));
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.default = router;
//# sourceMappingURL=post.js.map