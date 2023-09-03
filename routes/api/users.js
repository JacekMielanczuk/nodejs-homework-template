const express = require("express");
const { signUp, logIn, logOut, current } = require("../../controlers/users");
const { auth } = require("../../middleweres/jwtStrategy");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/logout", auth, logOut);
router.get("/current", auth, current);

module.exports = router;
