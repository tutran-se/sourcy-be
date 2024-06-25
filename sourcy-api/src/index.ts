import express from "express";
import cors from "cors";
import helmet from "helmet";
import sequelize from "./db/config";
import Product from "./db/Product";
import ProductVariants from "./db/ProductVariants";
import ProductAttributes from "./db/ProductAttributes";
import { Op } from "@sequelize/core";
import { WhereOptions } from "sequelize";
import { getRecommendations } from "./utils";

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cors
app.use(cors());

// Helmet
app.use(helmet());

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
      attributes: [
        "product_id",
        "title",
        "title_translated",
        "gpt_description",
        "image_urls",
      ],
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

// Get all related products of a product
app.get("/api/v1/products/recommendations", async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const products = await Product.findAll();
    const attributes = await ProductAttributes.findAll();
    const variants = await ProductVariants.findAll();

    const recommendations = getRecommendations(
      products.find((product) => product.product_id === Number(productId)),
      products,
      attributes,
      variants
    );

    res.status(200).json(recommendations);
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
