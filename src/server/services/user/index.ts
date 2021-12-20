import { createMachine, actions } from "xstate";
import { userModel } from "./model";
const { log } = actions;

// state machine
const userMachine = createMachine({
  id: "vending",
  initial: "idle",
  context: userModel.initialContext,
  states: {
    loading: {
      invoke: {
        id: 'load-user',
        src: () => Promise.resolve(true),
      },
    },
  },
});

export default userMachine;
