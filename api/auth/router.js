const express = require("express");
const Router = express.Router();
const bcrypt = require("bcryptjs");
const authRouter = Router;

const userModel = require("../user/model");

authRouter.post("/", (req, res) => {
    const {account, password} = req.body;
    if(!account || !password){
        res.status(400).send({success: 0, message: "Thiếu account hoặc password"});
    } else {
        userModel.findOne({account})
        .then(userFound => {
            if(!userFound || !userFound._id){
                res.status(404).send({success: 0, message: "Nguoi dung khong ton tai"});
            } else {
                if(bcrypt.compareSync(password, userFound.password)){
                    req.session.userAccount = {account};
                    res.status(200).redirect( "https://toyshop-client.herokuapp.com/"||"http://localhost:3000/")
                } else {
                    res.status(401).send({success: 0, message: "Sai mat khau"});
                }
            }
        })
        .catch(err => {
            res.status(500).send({success: 0, message: err});
        })
    }
})

authRouter.get("/me", (req, res) => {
    if(!req.session.userAccount){
        res.status(401).send({success: 0, message: "Ban chua dang nhap"})
    } else {
        userModel.findOne(req.session.userAccount, "-password")
        .then(userFound => {
            res.send({success: 1, message: userFound});
        })
        .catch(err => {
            res.status(500).send({success: 0, message: err});
        })
    }
})

authRouter.delete("/", (req, res) => {
    req.session.destroy();
    res.redirect("https://toyshop-client.herokuapp.com/" || "http://localhost:3000/");
})
module.exports = authRouter;