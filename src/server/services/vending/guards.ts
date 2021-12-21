import { VendingContext, VendingEvent } from "./types";

export const vendingIsValid = (ctx: VendingContext, event: VendingEvent): boolean =>
  event.type === 'selectItem' &&
  ctx.deposited > 0 &&
  event.item &&
  event.item.amountAvailable &&
  event.quantity > 0 &&
  event.quantity <= event.item.amountAvailable &&
  event.item.cost * event.quantity <= ctx.deposited;
