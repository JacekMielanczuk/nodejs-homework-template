const User = require("../models/user.schem");

const addUser = async (password, email, subscription) => {
  const user = await User.create({
    password: password,
    email: email,
    subscription: subscription,
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

module.exports = {
  addUser,
  findUserByMail,
  findUserForToken,
  setJwtInDb,
  deleteJwtInDb,
};
