// @ts-nocheck
import { createModel } from "xstate/lib/model";

// models
export const userModel = createModel(
  {
    balance: 0,
  },
);
