const jwt = require("jsonwebtoken");
const Users = require("../model/users");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const createFolderIsExist = require("../services/create-dir");
const EmailService = require("../services/email");
const { v4: uuid } = require("uuid");

require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
      return next({
        status: "Error",
        code: 409,
        message: "Email in use",
      });
    }

    const verificationToken = uuid();
    const emailService = new EmailService();
    await emailService.sendEmail(verificationToken, email);

    const newUser = await Users.create({ email, password, verificationToken });
    return res.status(201).json({
      status: "success",
      code: 201,
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          avatarURL: newUser.avatarURL,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user.validPassword(password);
    if (!user || !isValidPassword || !user.verify) {
      return next({
        status: "Error",
        code: 401,
        message: "Email or password is wrong",
      });
    }
    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "3h" });
    await Users.updateToken(id, token);
    return res.status(200).json({
      status: "success",
      code: 200,
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
          avatarURL: user.avatarURL,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, _next) => {
  const id = req.user.id;
  await Users.updateToken(id, null);
  return res.status(204).json({});
};

const currentUser = async (req, res, next) => {
  const id = req.user.id;
  try {
    const user = await Users.findById(id);
    return res.status(200).json({
      status: "success",
      code: 200,
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
          avatarURL: user.avatarURL,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const saveAvatar = async (req) => {
  const id = String(req.user._id);
  const AVATAR_DIR = path.join(process.cwd(), "public", "avatars");
  const pathFile = req.file.path;
  const newNameAvatar = `${Date.now()}-${req.file.originalname}`;
  const img = await Jimp.read(pathFile);
  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile);
  await createFolderIsExist(path.join(AVATAR_DIR, id));
  await fs.rename(pathFile, path.join(AVATAR_DIR, id, newNameAvatar));
  const avatarUrl = path.join(id, newNameAvatar);
  try {
    await fs.unlink(path.join(process.cwd(), AVATAR_DIR, req.user.avatarURL));
  } catch (e) {
    console.log(e.message);
  }
  return avatarUrl;
};

const avatars = async (req, res, next) => {
  try {
    const id = String(req.user._id);
    const avatarUrl = await saveAvatar(req);
    await Users.updateAvatar(id, avatarUrl);
    return res.json({
      status: "success",
      code: 200,
      data: {
        avatarUrl,
      },
    });
  } catch (e) {
    next(e);
  }
};

const verify = async (req, res, next) => {
  console.log(req.params.verificationToken);
  try {
    const user = await Users.findByVerificationToken(
      req.params.verificationToken
    );
    if (user) {
      return res.json({
        status: "success",
        code: 200,
        message: "Verification successful",
      });
    } else {
      return next({
        status: "Error",
        code: 404,
        message: "User not found",
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  signup,
  login,
  logout,
  currentUser,
  avatars,
  verify,
};
