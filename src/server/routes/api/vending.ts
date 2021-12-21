import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";

import auth from "../../middleware/auth";
import Product, { IProduct } from "../../models/Product";
import User, { IUser } from "../../models/User";
import {
  cacheVendingMachine,
  getCachedVendingMachine,
} from "../../services/vending/utils";

import Request from "../../types/Request";

const router: Router = Router();

// @route   POST api/vending/deposit
// @desc    Add deposit to vending machine
// @access  Private
router.post(
  "/deposit",
  [
    check("amount", "Please provide positive integer amount.").isInt({ gt: 0 }),
  ],
  auth,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { amount } = req.body;
    try {
      const user: IUser = await User.findById(req.userId);

      if (user.vendor) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "Vendors are not allowed to use vending machine.",
            },
          ],
        });
      }

      const vendingMachineService = getCachedVendingMachine(user);

      vendingMachineService.send("deposit", { value: amount });

      const cachedState = cacheVendingMachine(vendingMachineService, user);

      res.json(cachedState.context);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

// @route   POST api/vending/reset
// @desc    Add deposit to vending machine
// @access  Private
router.post("/reset", auth, async (req: Request, res: Response) => {

  try {
    const user: IUser = await User.findById(req.userId);

    if (user.vendor) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "Vendors are not allowed to use vending machine.",
          },
        ],
      });
    }

    const vendingMachineService = getCachedVendingMachine(user);

    vendingMachineService.send("payout");

    const cachedState = cacheVendingMachine(vendingMachineService, user);

    res.json(cachedState.context);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   POST api/vending/buy
// @desc    Add deposit to vending machine
// @access  Private
router.post(
  "/buy",
  [check("productId").isAlphanumeric(), check("amount").isInt({ gt: 0 })],
  auth,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { productId, amount } = req.body;

    try {
      const user: IUser = await User.findById(req.userId);
      const product: IProduct = await Product.findById(productId);

      if (user.vendor) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "Vendors are not allowed to use vending machine.",
            },
          ],
        });
      }

      if (!product) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "Product not found.",
            },
          ],
        });
      }

      const vendingMachineService = getCachedVendingMachine(user);

      vendingMachineService.send("selectItem", {
        item: product,
        quantity: amount,
      });

      vendingMachineService.onTransition((t) => {
        if (t.value === "idle") {
          const cachedState = cacheVendingMachine(vendingMachineService, user);
          res.json(cachedState.context);
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);



// @route   GET api/vending/state
// @desc    Add deposit to vending machine
// @access  Private
router.get("/state", auth, async (req: Request, res: Response) => {
  try {
    const user: IUser = await User.findById(req.userId);

    if (user.vendor) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "Vendors are not allowed to use vending machine.",
          },
        ],
      });
    }

    const vendingMachineService = getCachedVendingMachine(user);

    res.json(vendingMachineService.state);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export default router;
