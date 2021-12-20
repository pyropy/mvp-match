import { Router, Response } from "express";
import HttpStatusCodes from "http-status-codes";
import { interpret } from "xstate";

import auth from "../../middleware/auth";
import vendingMachine from "../../services/vending";
import Request from "../../types/Request";

const router: Router = Router();

// @route   GET api/vending/deposit
// @desc    Add deposit to vending machine
// @access  Private
router.get("/deposit", auth, async (req: Request, res: Response) => {
  try {
    const vendingMachineService = interpret(vendingMachine).onTransition((s) =>
      console.log(s.value)
    );

    vendingMachineService.onChange((ctx) => console.log(ctx))

    res.json({ test: 1 });
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export default router;
