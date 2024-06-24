// Import necessary components from Sequelize
import { Model, DataTypes } from "sequelize";
import sequelize from "./config";

// Define a class extending Model
class ProductAttributes extends Model {
  public product_id!: number;
  public product_attribute_id!: number;
  public scrape_product_attribute_id!: number;
  public product_attribute_key!: string;
  public product_attribute_value!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

// Initialize the model
ProductAttributes.init(
  {
    product_id: {
      type: DataTypes.INTEGER,
    },
    product_attribute_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    scrape_product_attribute_id: {
      type: DataTypes.INTEGER,
    },
    product_attribute_key: {
      type: DataTypes.TEXT(),
    },
    product_attribute_value: {
      type: DataTypes.TEXT(),
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "product_attributes",
    sequelize: sequelize,
    timestamps: false,
  }
);

export default ProductAttributes;
