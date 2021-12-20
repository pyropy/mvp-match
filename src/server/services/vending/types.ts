import { EventObject } from "xstate/lib/types";
import { IProduct } from "../../models/Product";

// The events that the machine handles
export type VendingEvent =
  | { type: "selectItem"; item: IProduct }
  | { type: "deposit"; value: number }
  | { type: "payout" };

// The context (extended state) of the machine
export interface VendingContext {
  deposited: number;
  userId: string;
  selected?: IProduct;
  userActor: any;
}

export type VendingTypestate =
  | {
      value: "idle";
      context: VendingContext;
    }
  | {
      value: "vending";
      context: VendingContext;
    };
