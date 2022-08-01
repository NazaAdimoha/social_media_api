import express, { request } from 'express';
import { Request, Response, NextFunction } from 'express';
const  router = express.Router();
import User from "../models/user"
import bcrypt from "bcrypt"

//REGISTER
router.post('/register', async (req:Request, res:Response, next:NextFunction) => {
try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
 //generate new password
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      })

    const user = await newUser.save()
    res.status(200).json(user)
} catch(err) {
    console.log(err)
}
});

//LOGIN USER
router.post('/login', async (req:Request, res:Response, next:NextFunction) => {
    try {
        const user = await User.findOne({email: req.body.email})
        !user && res.status(404).json("user not found")

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("wrong password")
        res.status(200).json(user)
    } catch(err) {
        console.log(err)
    }
    });


export default router;