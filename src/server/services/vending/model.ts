// @ts-nocheck
import { createModel } from "xstate/lib/model";
import Product from "../../models/Product";

// models
export const vendingModel = createModel(
  {
    deposited: 0,
    selected: undefined,
  },
  {
    events: {
      deposit: (value: number) => ({ value }),
      selectItem: (item: typeof Product) => ({ item }),
      payout: () => ({}),
    },
  }
);
