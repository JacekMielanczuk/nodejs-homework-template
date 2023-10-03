const User = require("../models/user.model");

const userLogout = async (id) =>
  await User.findByIdAndUpdate(id, { token: null });

const updateAvatar = async (userId, avatarURL) => {
  return User.findByIdAndUpdate(userId, { avatarURL });
};

// const updateVerificationToken = async (verificationToken) => {
//   return User.findOneAndUpdate(
//     { verificationToken },
//     { verify: true, verificationToken: null }
//   );
// };
// początek poprawnego kodu
const updateVerificationToken = async (verificationToken) => {
  try {
    if (typeof verificationToken !== "string") {
      throw new Error("Invalid verificationToken type");
    }

    const updatedUser = await User.findOneAndUpdate(
      { verificationToken },
      { verify: true, verificationToken: null },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found for the provided verificationToken");
    }

    return updatedUser;
  } catch (error) {
    console.error(error);

    throw new Error("Failed to update verification token");
  }
};
// koniec poprawionego kodu

module.exports = { userLogout, updateAvatar, updateVerificationToken };
