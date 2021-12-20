import bodyParser from "body-parser";
import express from "express";

import connectDB from "./services/database";
import auth from "./routes/api/auth";
import user from "./routes/api/user";
import product from "./routes/api/product";
import vending from "./routes/api/vending";

const app = express();

// Connect to MongoDB
connectDB();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/product", product);
app.use("/api/vending", vending);

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;
