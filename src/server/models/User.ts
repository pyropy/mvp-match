import { Document, Model, model, Schema } from "mongoose";

/**
 * Interface to model the User Schema for TypeScript.
 * @param email:string
 * @param password:string
 * @param avatar:string
 * @param vendor:boolean
 * @param balance:number
 */
export interface IUser extends Document {
  id?: string;
  email: string;
  password: string;
  avatar: string;
  vendor: boolean;
  balance: number;
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  vendor: {
    type: Boolean,
    default: false,
  },
  balance: {
    type: Number,
    default: 0,
  },
});

const User: Model<IUser> = model("User", userSchema);

export default User;
