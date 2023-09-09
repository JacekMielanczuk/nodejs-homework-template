const User = require("../models/user.schem");

const addUser = async (password, email, avatarUrl, subscription) => {
  const user = await User.create({
    password: password,
    email: email,
    subscription: subscription,
    avatarUrl: avatarUrl,
  });
  return user;
};

const findUserByMail = async (email) => await User.findOne({ email }).lean();

const findUserForToken = async (id) => {
  const user = await User.findById(id);
  return user;
};

const setJwtInDb = async (userId, token) => {
  const writeToken = await User.findByIdAndUpdate(userId, token, { new: true });
  return writeToken;
};

const deleteJwtInDb = async (userId) => {
  const token = { token: null };
  await User.findByIdAndUpdate(userId, token, { new: true });
  return null;
};

const pathAvatarInDb = async (userId, avatarUrl) => {
  const avatar = await User.findByIdAndUpdate(userId, avatarUrl, { new: true });
  return avatar;
};

module.exports = {
  addUser,
  findUserByMail,
  findUserForToken,
  setJwtInDb,
  deleteJwtInDb,
  pathAvatarInDb,
};
