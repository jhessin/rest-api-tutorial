import "dotenv/config";
import express from "express";
import apiRoutes from "./routes/api";

const PORT = process.env.PORT || 8080;
const app = express();

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use("/api", apiRoutes);

app.get("/", (req, res) => res.send("Hello World"));

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
