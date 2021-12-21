import { actions } from "xstate";
import { vendingModel } from "./model";
import { VendingContext, VendingEvent } from "./types";

const { choose, log } = actions;

/*
 * Sets new selected item and quantity
 */
const selectItem = vendingModel.assign({
  // @ts-ignore
  selected: (_ctx: VendingContext, event: VendingEvent) =>
    event.type === "selectItem"
      ? { item: event.item, quantity: event.quantity }
      : undefined,
});

/*
 * Conditional set item action.
 * It is possible to if amount availalble and quantity is bigger then zero
 * and selected quantity is not bigger then amount availalble.
 */
export const selectItemActions = choose([
  {
    // @ts-ignore
    cond: (_ctx, event: VendingEvent) =>
      event.type === "selectItem" &&
      event.item &&
      event.item.amountAvailable > 0 &&
      event.quantity > 0 &&
      event.quantity <= event.item.amountAvailable,
    // @ts-ignore
    actions: [selectItem, log("Selecting item")],
  },
  {
    actions: [log("Selected item not available.")],
  },
]);

const acceptedCoins = [5, 10, 20, 50, 100];

/*
 * Computes new deposited amount.
 */
const deposit = vendingModel.assign({
  deposited: (ctx, event) =>
    event.type === "deposit" ? ctx.deposited + event.value : ctx.deposited,
});

/*
 * Conditional deposit action.
 * Deposit is possible if user has balance then 0,
 * user balance is bigger then current deposited amount + new deposit
 * and new deposit amount is included in accepted coins array.
 */
export const depositActions = choose([
  {
    // @ts-ignore
    cond: (ctx: VendingContext, event: VendingEvent) =>
      event.type === "deposit" &&
      acceptedCoins.includes(event.value) &&
      ctx.userBalance &&
      ctx.userBalance > 0 &&
      ctx.userBalance >= event.value + ctx.deposited,

    // @ts-ignore
    actions: [deposit, log("Depositing")],
  },
  {
    actions: [log("Given value not acceptable")],
  },
]);

const payout = vendingModel.assign({
  deposited: 0,
});

/*
 * Conditional payout action. Payouts are allowed if deposited amount
 * is included in allowed coins array.
 */
export const payoutActions = choose([
  {
    // @ts-ignore
    cond: (ctx: VendingContext, event: VendingEvent) =>
      event.type === "payout" && acceptedCoins.includes(ctx.deposited),
    // @ts-ignore
    actions: [payout, log("Paying out deposit.")],
  },
  {
    actions: [log("Not possible to payout given value.")],
  },
]);

/*
 * Restarts selected item to undefined and quantity to 0.
 */
export const restartSelectedItem = vendingModel.assign({
  selected: (_ctx, _event: any) => ({ item: undefined, quantity: 0 }),
});

/*
 * On vending resets selected item and sets deposited to change amount.
 */
export const onVendingFinish = vendingModel.assign({
  deposited: (ctx: VendingContext, _event: any) =>
    ctx.deposited - ctx.selected.item.cost * ctx.selected.quantity,
  selected: (_ctx: VendingContext, _event: any) => ({
    item: undefined,
    quantity: 0,
  }),
});
