import { IProduct } from "../../models/Product";
import { IUser } from "../../models/User";

// The events that the machine handles
export type VendingEvent =
  | { type: "userData"; data: IUser }
  | { type: "selectItem"; item: IProduct; quantity: number; }
  | { type: "deposit"; value: number }
  | { type: "payout" };

// The context (extended state) of the machine
export interface VendingContext {
  deposited: number;
  userId: string;
  selected: {
    item?: IProduct
    quantity?: number;
  };
  userBalance?: number;
  userRef?: any;
}

export type VendingTypestate =
  | {
      value: "updateBalance";
      context: VendingContext;
    }
  | {
      value: "idle";
      context: VendingContext;
    }
  | {
      value: "vending";
      context: VendingContext;
    };
