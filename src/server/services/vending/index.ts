import { createMachine, actions } from "xstate";
import {
  afterVending,
  depositActions,
  payoutActions,
  restartSelectedItem,
  selectItemActions,
} from "./actions";
import { vendingIsValid } from "./guards";
import { vendingModel } from "./model";
import { VendingContext, VendingEvent, VendingTypestate } from "./types";
const { log } = actions;

const vend = (context, event): Promise<boolean> =>
  new Promise((resolve, reject) => {
    return resolve(true);
  });

// state machine
const vendingMachine = createMachine<
  VendingContext,
  VendingEvent,
  VendingTypestate
>(
  {
    id: "vending",
    initial: "idle",
    context: vendingModel.initialContext,
    states: {
      idle: {
        on: {
          selectItem: {
            target: "vending",
            actions: selectItemActions,
            cond: vendingIsValid,
          },
          deposit: {
            actions: depositActions,
          },
          payout: {
            actions: payoutActions,
          },
        },
      },
      vending: {
        // @ts-ignore
        invoke: {
          id: "vending",
          src: vend,
          onError: {
            target: "idle",
            actions: [
              restartSelectedItem,
              log("Error while tring to vend items"),
            ],
          },
          onDone: {
            target: "idle",
            actions: [afterVending, log("Vending finished")],
          },
        },
      },
    },
  },
  {
    guards: {
      vendingIsValid,
    },
  }
);

export default vendingMachine;
