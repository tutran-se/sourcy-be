// Import necessary components from Sequelize
import { Model, DataTypes } from "sequelize";
import sequelize from "./config";

// Define a class extending Model
class Product extends Model {
  public product_id!: number;
  public scrape_product_id!: number;
  public platform_id!: number;
  public supplier_id!: number;
  public stock_count!: number;
  public repurchase_rate!: number;
  public is_validated!: boolean;
  public is_catalogued!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
  public stock_units!: string;
  public keyword!: string;
  public link!: string;
  public title_translated!: string;
  public gpt_category_suggestion!: string;
  public gpt_description!: string;
  public product_label!: string;
  public trending_label!: string;
  public title!: string;
  public image_urls!: string;
}

// Initialize the model
Product.init(
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    scrape_product_id: {
      type: DataTypes.INTEGER,
    },
    platform_id: {
      type: DataTypes.INTEGER,
    },
    supplier_id: {
      type: DataTypes.INTEGER,
    },
    stock_count: {
      type: DataTypes.INTEGER,
    },
    repurchase_rate: {
      type: DataTypes.FLOAT,
    },
    is_validated: {
      type: DataTypes.BOOLEAN,
    },
    is_catalogued: {
      type: DataTypes.BOOLEAN,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    stock_units: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    keyword: {
      type: new DataTypes.STRING(128),
    },
    link: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    title_translated: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    gpt_category_suggestion: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    gpt_description: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    product_label: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    trending_label: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    title: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    image_urls: {
      type: new DataTypes.TEXT(),
      allowNull: false,
    },
  },
  {
    tableName: "products",
    sequelize: sequelize,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["product_id"],
      },
      // index for searching
      {
        fields: ["title"],
      },
      {
        fields: ["title_translated"],
      },
      {
        fields: ["keyword"],
      },
      {
        fields: ["gpt_category_suggestion"],
      },
      {
        fields: ["gpt_description"],
      },
      {
        fields: ["product_label"],
      },
      {
        fields: ["trending_label"],
      },
    ],
  }
);

export default Product;
