import { interpret, State } from "xstate";
import { IUser } from "../../models/User";
import cacheService from "../../services/cache";
import vendingMachine from "../../services/vending";
import { VendingContext, VendingEvent } from "../../services/vending/types";

export const getCachedVendingMachine = (user: IUser) => {
  const stateDefinition = cacheService.get(user.id);
  const previousState: State<VendingContext, VendingEvent> =
    State.create(stateDefinition);

  return interpret(vendingMachine).start(previousState);
};

export const cacheVendingMachine = (vendingMachineService, user: IUser) => {
  const state = vendingMachineService.state;

  cacheService.put(user.id, state);

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
      userBalance: user.balance,
    })
  ).start();

  cacheVendingMachine(machine, user);
};
