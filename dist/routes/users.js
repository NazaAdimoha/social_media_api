"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
//UPDATE USER
router.put('/:id', async (req, res, next) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt_1.default.genSalt(10);
                req.body.password = await bcrypt_1.default.hash(req.body.password, salt);
            }
            catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await user_1.default.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has been updated");
        }
        catch (err) {
            return res.status(500).json(err);
        }
    }
    else {
        return res.status(403).json("you can update only your account");
    }
});
router.delete('/:id', async (req, res, next) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await user_1.default.findByIdAndDelete(req.params.id);
            return res.status(200).json("Account has been deleted");
        }
        catch (err) {
            return res.status(500).json(err);
        }
    }
    else {
        return res.status(403).json("you can delete only your account");
    }
});
//GET USER
router.get('/:id', async (req, res, next) => {
    try {
        const user = await user_1.default.findById(req.params.id);
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//FOLLOW USER
router.put('/:id/follow', async (req, res, next) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await user_1.default.findById(req.params.id);
            const currentUser = await user_1.default.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { following: req.body.userId } });
                res.status(200).json("user has been followed");
            }
            else {
                res.status(403).json("you already follow this user");
            }
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("you cant follow yourself");
    }
});
//UNFOLLOW USER
router.put('/:id/unfollow', async (req, res, next) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await user_1.default.findById(req.params.id);
            const currentUser = await user_1.default.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { following: req.body.userId } });
                res.status(200).json("user has been unfollowed");
            }
            else {
                res.status(403).json("you dont follow this user");
            }
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("you cant follow yourself");
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map