import { Document, Model, model, Schema } from "mongoose";

/**
 * Interface to model the User Schema for TypeScript.
 * @param productName:string
 * @param cost:number
 * @param amountAvailable:number
 * @param sellerId:
 */
export interface IProduct extends Document {
  productName: string;
  cost: string;
  amountAvailable: string;
  sellerId: boolean;
}

const productSchema: Schema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  amountAvailable: {
    type: Number,
    default: 0,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Product: Model<IProduct> = model("Product", productSchema);

export default Product;
