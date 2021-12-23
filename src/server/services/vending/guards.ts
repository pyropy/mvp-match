import { VendingContext, VendingEvent } from "./types";

/*
 * Allow vending only if user has deposited money,
 * has specified selected product and quantity,
 * there is enough of selected product for selected quantity,
 * and user has deposited enough money to buy selected item quantity.
 */
export const vendingIsValid = (
  ctx: VendingContext,
  event: VendingEvent
): boolean =>
  event.type === "selectItem" &&
  ctx.deposited > 0 &&
  event.item &&
  event.item.amountAvailable &&
  event.quantity > 0 &&
  event.quantity <= event.item.amountAvailable &&
  event.item.cost * event.quantity <= ctx.deposited;
