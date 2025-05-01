require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

// enable cors
app.use(cors());
//enable json parser
app.use(express.json());

//route the Note api
const noteRoutes = require("./routes/note");
//use the route
app.use("/api/notes", noteRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("welcom to API");
});

app.listen(port, (err) => {
  if (!err) {
    console.log("Server is successfully listening on port : ", port);
  } else {
    console.error("Error starting the server:", err);
  }
});

main().catch((error) => {
  console.error(error);
});

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  mongoose.set("strictQuery", true);
}
