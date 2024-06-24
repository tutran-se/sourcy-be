import express from "express";
import Product from "./db/Product";
import ProductVariants from "./db/ProductVariants";
import ProductAttributes from "./db/ProductAttributes";
import sequelize from "./db/config";

const app = express();
const port = process.env.PORT || 5000;

app.get("/", async (req, res) => {
  res.send("Health check!!!");
});

app.get("/search", async (req, res) => {
  const products = await Product.findAll({
    limit: 1,
  });
  const variants = await ProductVariants.findAll({
    limit: 1,
  });

  const attributes = await ProductAttributes.findAll({
    limit: 1,
  });

  res.json({ products, variants, attributes });
});

const main = async () => {
  try {
    // Verify connection
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Start server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

main();
