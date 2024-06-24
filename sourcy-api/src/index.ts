import express from "express";
import Product from "./db/Product";
import sequelize from "./db/config";
import { Op } from "@sequelize/core";
import { WhereOptions } from "sequelize";

const app = express();
const port = process.env.PORT || 5000;

// Health check
app.get("/healthz", async (_, res) => {
  res.send("Health check!!!");
});

// Get all products by search term
app.get("/api/v1/products/search", async (req, res) => {
  try {
    const { searchTerm } = req.query;

    if (!searchTerm) {
      return res.status(400).json({ message: "searchTerm is required" });
    }

    const products = await Product.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            title_translated: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            keyword: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            gpt_category_suggestion: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            gpt_description: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            product_label: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            trending_label: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
        ],
      } as WhereOptions<any>,
    });

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }
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
