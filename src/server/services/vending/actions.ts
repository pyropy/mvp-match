import { actions } from "xstate";
import { vendingModel } from "./model";
import { VendingContext, VendingEvent } from "./types";

const { choose, log } = actions;

// actions
const selectItem = vendingModel.assign({
  selected: (_context: VendingContext, event: VendingEvent) =>
    event.type === "selectItem"
      ? { item: event.item, quantity: event.quantity }
      : undefined,
});

const deposit = vendingModel.assign({
  deposited: (context, event) =>
    event.type === "deposit"
      ? context.deposited + event.value
      : context.deposited,
});

const payout = vendingModel.assign({
  deposited: 0, // todo add changing db
});

// select items conditional actions
export const selectItemActions = choose([
  {
    // @ts-ignore
    cond: (_context, event: VendingEvent) =>
      event.type === "selectItem" &&
      event.item.amountAvailable > 0 &&
      event.quantity > 0,
    // @ts-ignore
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
    // @ts-ignore
    cond: (context: VendingContext, event: VendingEvent) =>
      event.type === "deposit" &&
      acceptedValues.includes(event.value) &&
      context.userBalance &&
      context.userBalance > 0 &&
      context.userBalance >= event.value + context.deposited,

    // @ts-ignore
    actions: [deposit, log("Depositing")],
  },
  {
    actions: [log("Given value not acceptable")],
  },
]);

export const payoutActions = choose([
  {
    // @ts-ignore
    cond: (context: VendingContext, event: VendingEvent) =>
      event.type === "payout" && acceptedValues.includes(context.deposited),
    // @ts-ignore
    actions: [payout, log("Paying out deposit.")],
  },
  {
    actions: [log("Not possible to payout given value.")],
  },
]);

export const restartSelectedItems = vendingModel.assign({
  selected: (_context, _event: any) => ({ item: undefined, quantity: 0 }),
});

// after vending is finished set deposited to change and selected to undefined
export const onVendingFinish = vendingModel.assign({
  deposited: (context: VendingContext, _event: any) =>
    context.deposited - context.selected.item.cost,
  selected: (_context: VendingContext, _event: any) => ({
    item: undefined,
    quantity: 0,
  }),
});
