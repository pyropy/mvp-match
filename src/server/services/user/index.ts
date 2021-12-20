import { createMachine, actions } from "xstate";
import { userModel } from "./model";
import User from "../../models/User";
import { assign } from "xstate/lib/actionTypes";
const { log } = actions;

const getUser = async (userId) =>  ({balance: 100}) // User.findById(userId);

// state machine
const userMachine = createMachine({
  id: "user",
  initial: "loading",
  context: userModel.initialContext,
  states: {
    idle: {
      on: {
        fetch: { target: "loading" },
      },
    },
    success: {},
    failure: {
      on: {
        retry: { target: "loading" },
      },
    },
    loading: {
      invoke: {
        id: "getUser",
        src: (context, _event: any) => getUser(context.userId),
      },
      // @ts-ignore
      onDone: {
        target: "success",
        actions: userModel.assign({
          user: (_, event: any) => {
            console.log(event.data)
            return event.data
          },
        }),
      },
      // @ts-ignore
      onError: {
        target: "failure",
        actions: userModel.assign({
          user: (_, event: any) => event.data,
        }),
      },
    },
  },
});

export default userMachine;
