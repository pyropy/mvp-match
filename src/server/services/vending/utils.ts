import { interpret, State } from "xstate";
import { IUser } from "../../models/User";
import cacheService from "../../services/cache";
import vendingMachine from "../../services/vending";
import { VendingContext, VendingEvent } from "../../services/vending/types";

export const getCachedVendingMachine = (userId: string) => {
  const stateDefinition = cacheService.get(userId);
  const previousState: State<VendingContext, VendingEvent> =
    State.create(stateDefinition);

  return interpret(vendingMachine).start(previousState);
};

export const cacheVendingMachine = (vendingMachineService, userId: string) => {
  const state = vendingMachineService.state;

  cacheService.put(userId, state);

  return state;
};

export const createAndCacheNewVendingMachine = (user: IUser) => {
  const machine = interpret(
    vendingMachine.withContext({
      userId: user.id,
      deposited: 0,
      selected: {
        item: undefined,
        quantity: 0,
      },
      tray: {
        item: undefined,
        quantity: 0,
        change: 0,
        total: 0,
      },
      userBalance: user.balance,
    })
  ).start();

  return cacheVendingMachine(machine, user.id);
};
