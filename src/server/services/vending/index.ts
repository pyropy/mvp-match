import { createMachine, actions, assign } from "xstate";
import { vendingModel } from "./model";
import {
  onVendingFinish,
  depositActions,
  payoutActions,
  restartSelectedItem,
  selectItemActions,
} from "./actions";
import { vendingIsValid } from "./guards";
import { VendingContext, VendingEvent, VendingMachineStates } from "./types";
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
      [VendingMachineStates.UpdateBalance]: {
        // @ts-ignore
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
          // @ts-ignore
          selectItem: {
            target: VendingMachineStates.Vending,
            actions: selectItemActions,
            cond: vendingIsValid,
          },
          // @ts-ignore
          deposit: {
            actions: depositActions,
          },
          // @ts-ignore
          payout: {
            actions: payoutActions,
          },
        },
      },
      [VendingMachineStates.Vending]: {
        // @ts-ignore
        invoke: {
          id: "vending",
          src: vendSelectedProduct,
          onDone: {
            target: VendingMachineStates.UpdateBalance,
            actions: [onVendingFinish, log("Vending finished")],
          },
          onError: {
            target: VendingMachineStates.UpdateBalance,
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
