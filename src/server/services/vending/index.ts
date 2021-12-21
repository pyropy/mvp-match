import { createMachine, actions, send, assign, spawn, interpret } from "xstate";
import { vendingModel } from "./model";
import {
  onVendingFinish,
  depositActions,
  payoutActions,
  restartSelectedItems,
  selectItemActions,
} from "./actions";
import { vendingIsValid } from "./guards";
import { VendingContext, VendingEvent } from "./types";
import User from "../../models/User";
const { log } = actions;

const vendSelectedProduct = async (context, _event) => {
  const { deposit, selected } = context;

  return true;
};

// const fetchUser = (ctx, event) => Promise.resolve({ balance: 100})

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
          onError: {
            target: "updateBalance",
            actions: [
              restartSelectedItems,
              log("Error while tring to vend items"),
            ],
          },
          onDone: {
            target: "updateBalance",
            actions: [onVendingFinish, log("Vending finished")],
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
        return User.findOne({ userId: ctx.userId });
      },
    },
  }
);

export default vendingMachine;
