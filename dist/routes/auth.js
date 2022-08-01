"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
//REGISTER
router.post('/register', async (req, res, next) => {
    try {
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(req.body.password, salt);
        //generate new password
        const newUser = new user_1.default({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        const user = await newUser.save();
        res.status(200).json(user);
    }
    catch (err) {
        console.log(err);
    }
});
//LOGIN USER
router.post('/login', async (req, res, next) => {
    try {
        const user = await user_1.default.findOne({ email: req.body.email });
        !user && res.status(404).json("user not found");
        const validPassword = await bcrypt_1.default.compare(req.body.password, user.password);
        !validPassword && res.status(400).json("wrong password");
        res.status(200).json(user);
    }
    catch (err) {
        console.log(err);
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map