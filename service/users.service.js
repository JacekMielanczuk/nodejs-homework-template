const User = require("../models/user.model");

const userLogout = async (id) =>
  await User.findByIdAndUpdate(id, { token: null });

const updateAvatar = async (userId, avatarURL) => {
  return User.findByIdAndUpdate(userId, { avatarURL });
};

const updateVerificationToken = async (verificationToken) => {
  return User.findOneAndUpdate(
    { verificationToken },
    { verify: true, verificationToken: null }
  );
};

module.exports = { userLogout, updateAvatar, updateVerificationToken };
