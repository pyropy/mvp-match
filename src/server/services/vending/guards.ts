
// guards
export const vendingIsValid = (context, event): boolean =>
  context.deposited > 0 &&
  event.item.amountAvailable &&
  event.item.cost <= context.deposited;
