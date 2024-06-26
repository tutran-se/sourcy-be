import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import sequelize from "./db/config";
import Product from "./db/Product";
import ProductVariants from "./db/ProductVariants";
import ProductAttributes from "./db/ProductAttributes";
import { check, validationResult } from "express-validator";

import { Op } from "@sequelize/core";
import { WhereOptions } from "sequelize";
import { getRecommendations, initializeRecommenderData } from "./utils";

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
app.get(
  "/api/v1/products/search",
  [check("searchTerm").trim().escape()],
  async (req: Request, res: Response) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { searchTerm } = req.query;

      if (!searchTerm || typeof searchTerm !== "string") {
        return res
          .status(400)
          .json({ message: "searchTerm is required and must be a string" });
      }

      // Split the search term into words
      const searchWords = searchTerm
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 2);

      if (searchWords.length === 0) {
        return res.status(400).json({
          message:
            "Search term must contain at least one word with more than 2 characters",
        });
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
          [Op.and]: searchWords.map((word) => ({
            [Op.or]: [
              { title: { [Op.iLike]: `% ${word} %` } },
              { title_translated: { [Op.iLike]: `% ${word} %` } },
              { keyword: { [Op.iLike]: `% ${word} %` } },
              { gpt_category_suggestion: { [Op.iLike]: `% ${word} %` } },
              { gpt_description: { [Op.iLike]: `% ${word} %` } },
              { product_label: { [Op.iLike]: `% ${word} %` } },
              { trending_label: { [Op.iLike]: `% ${word} %` } },
            ],
          })),
        } as WhereOptions<Partial<Product>>,
      });

      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error,
      });
    }
  }
);

// Get all related products of a product
app.get(
  "/api/v1/products/recommendations",
  [check("productId").isInt().toInt()],
  async (req: Request, res: Response) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { productId } = req.query;

      if (!productId) {
        return res.status(400).json({ message: "productId is required" });
      }

      const products = await Product.findAll();
      const attributes = await ProductAttributes.findAll();
      const variants = await ProductVariants.findAll();

      // Initialize the recommender data: extract, tokenize, and calculate IDF
      const recommenderData = initializeRecommenderData(
        products,
        attributes,
        variants
      );

      // Get recommendations for a specific product
      const recommendations = getRecommendations(
        Number(productId),
        recommenderData,
        0.5
      );

      res.status(200).json(recommendations);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error,
      });
    }
  }
);

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
