import { createModel } from "xstate/lib/model";
import { IProduct } from "../../models/Product";
import { IUser } from "../../models/User";

// models
export const vendingModel = createModel(
  {
    deposited: 0,
    userBalance: 0,
    selected: {
      item: undefined,
      quantity: 0,
    },
    userId: undefined,
    userRef: undefined,
  },
  {
    events: {
      userData: (data: IUser) => ({ data }),
      deposit: (value: number) => ({ value }),
      selectItems: (item: IProduct, quantity: number) => ({ item, quantity }),
      payout: () => ({}),
    },
  }
);
