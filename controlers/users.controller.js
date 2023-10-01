const { nanoid } = require("nanoid");
const sgMail = require("../utils/sendemail");
const User = require("../models/user.model");
const validateUser = require("../utils/validation");
const { userLogout } = require("../service/users.service");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;
const gravatar = require("gravatar");

const fs = require("fs/promises");
const Jimp = require("jimp");
const { imageStore } = require("../upload");
const service = require("../service/users.service");

const signUp = async (req, res, next) => {
  const { email, password } = req.body;

  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findOne({ email });

  if (user) {
    return res.json({
      Status: "error",
      code: 409,
      data: "Conflict",
      message: "Email in use",
    });
  }
  try {
    const avatarURL = gravatar.url(
      email,
      {
        s: "200",
        r: "pg",
        d: "mm",
      },
      true
    );

    const verificationToken = nanoid();

    const newUser = new User({ email, avatarURL, verificationToken });

    console.log(newUser);
    newUser.setPassword(password);
    /* newUser.set("avatarURL", avatarURL, String); */

    await newUser.save();
    if (verificationToken) {
      sgMail.sendVerificationToken(email, verificationToken);
    }

    res.json({
      status: "success",
      code: 201,
      data: {
        user: {
          email: `${email}`,
          subscription: "starter",
          avatar: `${avatarURL}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.json({
      status: "error",
      code: 400,
      data: "Bad request",
      message: "Email or password is wrong",
    });
  }

  if (!user.verify) {
    return res.status(401).json({
      status: "Unauthorized",
      code: 401,
      message: "Please verify Your account first",
    });
  }

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "3000s" });
  return res.json({
    status: "success",
    code: 200,
    data: {
      token: `${token}`,
      user: {
        email: `${email}`,
        subscription: "starter",
      },
    },
  });
};

const current = async (req, res, next) => {
  const { email, avatarURL, verificationToken } = req.user;
  res.json({
    status: "success",
    code: 200,
    data: {
      email: `${email}`,
      subscription: "starter",
      avatarURL: `${avatarURL}`,
      verificationToken: `${verificationToken}`,
      user: `${req.user}`,
    },
  });
};

const logout = async (req, res, next) => {
  const { id } = req.user;
  try {
    await userLogout(id);

    res.json({
      status: "success",
      code: 204,
      data: {
        message: "You has been logged out",
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  const { id } = req.user;
  const avatarURL = `/avatars/av_${id}.png`;
  if (!req.file) {
    return res.status(400).json({ message: "There is no file" });
  }

  Jimp.read(req.file.path)
    .then((avatar) => {
      return avatar.resize(250, 250).write(`${imageStore}/av_${id}.png`);
    })
    .catch((error) => {
      console.error(error);
    });

  await service.updateAvatar(id, avatarURL);

  try {
    fs.unlink(req.file.path);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "OK",
      data: {
        avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  const { verificationToken } = req.params;
  try {
    const user = await service.updateVerificationToken(verificationToken);
    if (user) {
      res.status(200).json({
        status: "success",
        code: 200,
        message: "Verification succesful",
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `User not found`,
      });
    }
  } catch (error) {
    next(error);
  }
};

const resendVerificationMail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: "missing required field email" });
  }

  const user = await User.findOne({ email });
  // const user = await service.getUser({ email });

  if (!user) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect email ",
    });
  }
  if (user.verify) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Verification has already been passed",
    });
  }
  if (!user.verify) {
    sgMail.sendVerificationToken(email, user.verificationToken);
    return res.status(200).json({
      status: "succeess",
      code: 200,
      message: "Verification email sent",
    });
  }
};

module.exports = {
  signUp,
  login,
  current,
  logout,
  updateAvatar,
  verify,
  resendVerificationMail,
};
