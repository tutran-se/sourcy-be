// Import necessary components from Sequelize
import { Model, DataTypes } from "sequelize";
import sequelize from "./config";

// Define a class extending Model
class ProductVariants extends Model {
  public product_id!: number;
  public product_variant_id!: number;
  public scrape_product_variant_id!: number;
  public stock_count!: number;
  public price!: number;
  public weight_per_unit_kg!: number;
  public length_cm!: number;
  public width_cm!: number;
  public height_cm!: number;
  public product_variant_key!: string;
  public price_currency!: string;
  public stock_units!: string;
  public is_validated!: boolean;
  public is_catalogued!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

// Initialize the model
ProductVariants.init(
  {
    product_id: {
      type: DataTypes.INTEGER,
    },
    product_variant_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    scrape_product_variant_id: {
      type: DataTypes.INTEGER,
    },
    stock_count: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.FLOAT,
    },
    weight_per_unit_kg: {
      type: DataTypes.FLOAT,
    },
    length_cm: {
      type: DataTypes.FLOAT,
    },
    width_cm: {
      type: DataTypes.FLOAT,
    },
    height_cm: {
      type: DataTypes.FLOAT,
    },
    product_variant_key: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    price_currency: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    stock_units: {
      type: new DataTypes.STRING(128),
      allowNull: false,
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
  },
  {
    tableName: "product_variants",
    sequelize: sequelize,
    timestamps: false,
  }
);

export default ProductVariants;
