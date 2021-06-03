const User = require("../services/schemas/user");

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findById = async (id) => {
  return await User.findOne({ _id: id });
};

const create = async ({ email, password, verificationToken }) => {
  const user = new User({ email, password, verificationToken });
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateAvatar = async (id, avatarURL) => {
  return await User.updateOne({ _id: id }, { avatarURL });
};

const findByVerificationToken = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });
  if (user) {
    await User.findByIdAndUpdate(user.id, {
      verify: true,
      verificationToken: null,
    });
    return true;
  }
  return false;
};

module.exports = {
  findByEmail,
  findById,
  create,
  updateToken,
  updateAvatar,
  findByVerificationToken,
};
