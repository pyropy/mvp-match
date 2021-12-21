import { createMachine, actions, send, assign, spawn, interpret } from "xstate";
import { vendingModel } from "./model";
import {
  onVendingFinish,
  depositActions,
  payoutActions,
  restartSelectedItem,
  selectItemActions,
} from "./actions";
import { vendingIsValid } from "./guards";
import { VendingContext, VendingEvent } from "./types";
import User, { IUser } from "../../models/User";
import Product, { IProduct } from "../../models/Product";
const { log } = actions;

const vendSelectedProduct = async (context: VendingContext, _event) => {
  const {
    selected: { item, quantity },
    userId,
  } = context;

  const user: IUser = await User.findById(userId);
  const product: IProduct = await Product.findById(item.id);

  user.balance -= quantity * product.cost;
  product.amountAvailable -= quantity;

  await user.save();
  await product.save();
};

const vendingMachine = createMachine<VendingContext, VendingEvent>(
  {
    id: "vending",
    initial: "idle",
    context: vendingModel.initialContext,
    states: {
      updateBalance: {
        // @ts-ignore
        invoke: {
          id: "fetch-user",
          src: "fetchUser",
          onDone: {
            target: "idle",
            actions: assign({
              userBalance: (_, event) => event.data.balance,
            }),
          },
        },
      },
      idle: {
        on: {
          // @ts-ignore
          selectItem: {
            target: "vending",
            actions: selectItemActions,
            cond: vendingIsValid,
          },
          // @ts-ignore
          deposit: {
            actions: [depositActions],
          },
          // @ts-ignore
          payout: {
            actions: payoutActions,
          },
        },
      },
      vending: {
        // @ts-ignore
        invoke: {
          id: "vending",
          src: vendSelectedProduct,
          onDone: {
            target: "updateBalance",
            actions: [onVendingFinish, log("Vending finished")],
          },
          onError: {
            target: "updateBalance",
            actions: [
              restartSelectedItem,
              log("Error while tring to vend items"),
            ],
          },
        },
      },
    },
  },
  {
    guards: {
      vendingIsValid,
    },
    services: {
      fetchUser: async (ctx) => {
        return await User.findById(ctx.userId);
      },
    },
  }
);

export default vendingMachine;
