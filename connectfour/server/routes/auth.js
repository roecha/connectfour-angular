let express = require("express");
let users = require("../models/user");
let router = express.Router();
let bcrypt = require("bcrypt");

router.post("/login", (req, res, next) => {
    let user = users.getUserByUsername(req.body.email);
    const ERROR = "Invalid credentials";
    if (user) {
        req.session.regenerate(() => {
            bcrypt.compare(req.body.password, user.password, (error, result) => {
                if(result){
                    delete user.password;

                    req.session.cookie.expires = 600000;
                    req.session.user = user;
                    res.json(user);
                } else {
                    res.status(401).json(ERROR);
                }
            });
        });
    } else {
        res.status(401).json(ERROR);
    }
});

router.post("/logout", (req, res, next) => {
    req.session.destroy(() => {
        console.log(req.session);
        res.status(200).send({});
    });
});

module.exports = router;
