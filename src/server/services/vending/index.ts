import { createMachine, actions, send } from "xstate";
import { vendingModel } from "./model";
import {
  afterVending,
  depositActions,
  payoutActions,
  restartSelectedItem,
  selectItemActions,
  spawnUserActor,
} from "./actions";
import { vendingIsValid } from "./guards";
import { VendingContext, VendingEvent } from "./types";
const { log } = actions;

const vendSelectedProduct = async (context, _event) => {
  const { deposit, selected } = context;

  return true;
};

const vendingMachine = createMachine<VendingContext, VendingEvent>(
  {
    id: "vending",
    initial: "idle",
    context: vendingModel.initialContext,
    states: {
      idle: {
        // @ts-ignore
        entry: spawnUserActor,
        on: {
          // @ts-ignore
          selectItem: {
            target: "vending",
            actions: selectItemActions,
            cond: vendingIsValid,
          },
          // @ts-ignore
          deposit: {
            actions: ['fetchUser', depositActions],
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
    actions: {
      fetchUser: (event, context) => send({ type: "fetch"}, { to: (context: VendingContext) => context.userActor})
    },
    guards: {
      vendingIsValid,
    },
  }
);

export default vendingMachine;
