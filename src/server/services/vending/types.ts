import { EventObject } from "xstate/lib/types";
import Product from "../../models/Product";

// The events that the machine handles
export type VendingEvent =
  | { type: "selectItem"; item: typeof Product; }
  | { type: "deposit"; value: number; }
  | { type: "payout" };

// The context (extended state) of the machine
export interface VendingContext {
  deposited: number;
  selected?: typeof Product;
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
