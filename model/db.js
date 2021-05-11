const mongoose = require("mongoose");
require("dotenv").config();
const uriDb = process.env.DB_HOST;

const dbConnect = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

dbConnect
  .then(() => {
    console.log("Database connection successful.");
  })
  .catch((err) => {
    console.log(`Database connection failed. Error message: ${err.message}`);
    process.exit(1);
  });

module.exports = dbConnect;
