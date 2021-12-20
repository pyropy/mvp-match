// @ts-nocheck
import { createModel } from "xstate/lib/model";

// models
export const userModel = createModel(
  {
    userId: undefined,
    user: undefined,
  },
  {
    events: {
      retry: () => ({}),
      fetch: () => ({}),
    },
  }
);
