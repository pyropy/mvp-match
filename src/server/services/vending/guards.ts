// guards
export const vendingIsValid = (context, event): boolean =>
  context.deposited > 0 &&
  event.item &&
  event.item.amountAvailable &&
  event.item.cost <= context.deposited;
