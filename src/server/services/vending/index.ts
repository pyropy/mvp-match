import { createMachine, actions, assign } from "xstate";
import { vendingModel } from "./model";
import {
  onVendingFinish,
  depositActions,
  payout,
  restartSelectedItem,
  selectItemActions,
  vendSelectedProduct,
} from "./actions";
import { vendingIsValid } from "./guards";
import { VendingContext, VendingEvent, VendingMachineStates } from "./types";
import User from "../../models/User";

const { log } = actions;

const vendingMachine = createMachine<VendingContext, VendingEvent>(
  {
    id: "vending",
    initial: "idle",
    context: vendingModel.initialContext,
    states: {
      [VendingMachineStates.UpdateBalance]: {
        invoke: {
          id: "update-balance",
          src: "fetchUser",
          onDone: {
            target: VendingMachineStates.Idle,
            actions: assign({
              userBalance: (_, event) => event.data.balance,
            }),
          },
        },
      },
      [VendingMachineStates.Idle]: {
        on: {
          selectItem: {
            target: VendingMachineStates.Vending,
            actions: "selectItemActions",
            cond: vendingIsValid,
          },
          deposit: {
            actions: "depositActions",
          },
          payout: {
            actions: "payout",
          },
        },
      },
      [VendingMachineStates.Vending]: {
        invoke: {
          id: "vending",
          src: vendSelectedProduct,
          onDone: {
            target: VendingMachineStates.UpdateBalance,
            actions: ["onVendingFinish", log("Vending selected items")],
          },
          onError: {
            target: VendingMachineStates.UpdateBalance,
            actions: [
              "restartSelectedItem",
              log("Error while tring to vend items"),
            ],
          },
        },
      },
    },
  },
  {
    actions: {
      depositActions,
      payout,
      onVendingFinish,
      restartSelectedItem,
      selectItemActions,
    },
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
