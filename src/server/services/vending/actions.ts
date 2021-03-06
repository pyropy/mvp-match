import { actions, assign } from "xstate";
import { VendingContext, VendingEvent } from "./types";
import User, { IUser } from "../../models/User";
import Product, { IProduct } from "../../models/Product";

const { choose, log } = actions;

/*
 * Sets new selected item and quantity
 */
const selectItem = assign<VendingContext, VendingEvent>({
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
export const selectItemActions = choose<VendingContext, VendingEvent>([
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
const deposit = assign<VendingContext, VendingEvent>({
  deposited: (ctx, event) =>
    event.type === "deposit" ? ctx.deposited + event.value : ctx.deposited,
});

/*
 * Conditional deposit action.
 * Deposit is possible if user has balance then 0,
 * user balance is bigger then current deposited amount + new deposit
 * and new deposit amount is included in accepted coins array.
 */
export const depositActions = choose<VendingContext, VendingEvent>([
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
    actions: [log("Deposit not possible.")],
  },
]);

export const payout = assign<VendingContext, VendingEvent>({
  deposited: 0,
});


/*
 * Restarts selected item to undefined and quantity to 0.
 */
export const restartSelectedItem = assign<VendingContext, VendingEvent>({
  selected: (_ctx, _event: any) => ({ item: undefined, quantity: 0 }),
});

const calculateTotal = (ctx: VendingContext): number =>
  ctx.selected.item?.cost * ctx.selected.quantity;

const calculateChange = (ctx: VendingContext): number =>
  ctx.deposited - calculateTotal(ctx);

/*
 * On vending resets selected item and sets deposited to change amount.
 */
export const onVendingFinish = assign<VendingContext, VendingEvent>({
  deposited: (ctx: VendingContext, _event: any) => calculateChange(ctx),
  selected: () => ({
    item: undefined,
    quantity: 0,
  }),
  tray: (ctx: VendingContext, _event: any) => ({
    item: ctx.selected.item,
    quantity: ctx.selected.quantity,
    total: calculateTotal(ctx),
    change: calculateChange(ctx),
  }),
});

export const vendSelectedProduct = async (
  context: VendingContext,
  _event: any
) => {
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
