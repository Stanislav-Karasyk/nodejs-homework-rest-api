const app = require("../app");
const dbConnect = require("../model/db");

const PORT = process.env.PORT || 3000;

dbConnect.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch((err) => {
  console.log(`Server not started. Error message: ${err.message}`);
  process.exit(1);
});
