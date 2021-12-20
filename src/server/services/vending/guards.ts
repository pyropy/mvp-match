import { VendingContext, VendingEvent } from "./types";

// guards
export const vendingIsValid = (context: VendingContext, event: VendingEvent): boolean =>
  event.type === 'selectItem' &&
  context.deposited > 0 &&
  event.item &&
  event.item.amountAvailable &&
  event.item.cost <= context.deposited;
