import express from "express";

const app = express();
const port = 80;

app.get("/", (req, res) => {
  res.send("This is testttttttt!!!!!!!!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
