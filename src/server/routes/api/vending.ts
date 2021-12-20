import { Router, Response } from "express";
import HttpStatusCodes from "http-status-codes";
import { interpret, State } from "xstate";

import auth from "../../middleware/auth";
import cacheService from "../../services/cache";
import vendingMachine from "../../services/vending";
import { VendingContext, VendingEvent } from "../../services/vending/types";
import Request from "../../types/Request";

const router: Router = Router();

// @route   GET api/vending/deposit
// @desc    Add deposit to vending machine
// @access  Private
router.get("/deposit", async (req: Request, res: Response) => {
  try {
    const userId = "1";
    const stateDefinition =
      cacheService.get(userId) || vendingMachine.initialState;

    const previousState: State<VendingContext, VendingEvent> =
      State.create(stateDefinition);

    const vendingMachineService =
      interpret(vendingMachine).start(previousState);


    vendingMachineService.send("deposit", { value: 5 })

    const state = vendingMachineService.state;

    cacheService.put(userId, state);
    res.json({ state });
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export default router;
