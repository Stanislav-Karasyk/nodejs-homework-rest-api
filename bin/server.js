const app = require("../app");
const dbConnect = require("../model/db");
const createFolderIsExist = require("../services/create-dir");
require("dotenv").config();

const path = require("path");

const PORT = process.env.PORT || 3000;

dbConnect
  .then(() => {
    app.listen(PORT, async () => {
      const TMP_DIR = process.env.TMP_DIR;
      const AVATAR_DIR = path.join(process.cwd(), "public", "avatars");
      await createFolderIsExist(TMP_DIR);
      await createFolderIsExist(AVATAR_DIR);
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Server not started. Error message: ${err.message}`);
    process.exit(1);
  });
