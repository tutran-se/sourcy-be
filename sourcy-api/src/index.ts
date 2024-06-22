import express from "express";

const app = express();
const port = 80;

app.get("/", (req, res) => {
  res.send("Hello, world! This is for testing purposes!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
