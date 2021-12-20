// @ts-nocheck
import { actions, spawn } from "xstate";
import userMachine from "../user";
import { vendingModel } from "./model";

const { choose, log } = actions;

// actions
const selectItem = vendingModel.assign({
  selected: (_, event) => event.item,
});

const deposit = vendingModel.assign({
  deposited: (context, event) => context.deposited + event.value,
});

const payout = vendingModel.assign({
  deposited: 0, // todo add changing db
});

// select items conditional actions
export const selectItemActions = choose([
  {
    cond: (_, event) => event.item.amountAvailable > 0,
    actions: [selectItem, log("Selecting item")],
  },
  {
    actions: [log("Selected item not available.")],
  },
]);

// deposit conditional actions
const acceptedValues = [5, 10, 20, 50, 100];
export const depositActions = choose([
  {
    cond: (context, event) =>
      acceptedValues.includes(event.value),
      // context.userActor.state.context.user &&
      // context.userActor.state.context.user.balance >=
      //   event.value + context.deposited,

    actions: [deposit, log("Depositing")],
  },
  {
    actions: [log("Given value not acceptable")],
  },
]);

export const payoutActions = choose([
  {
    cond: (context, _) => acceptedValues.includes(context.deposit),
    actions: [payout, log("Paying out deposit.")],
  },
  {
    actions: [log("Not possible to payout given value.")],
  },
]);

export const restartSelectedItem = vendingModel.assign({
  selected: (context, event) => undefined,
});

// after vending is finished set deposited to change and selected to undefined
export const afterVending = vendingModel.assign({
  deposited: (context, event) => context.deposited - context.selected.cost,
  selected: (context, event) => undefined,
});

export const spawnUserActor = vendingModel.assign({
  userActor: (context, _) =>
    spawn(
      userMachine.withContext({ userId: context.userId, user: undefined }),
      { sync: true }
    ),
});
