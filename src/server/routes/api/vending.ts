import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";

import auth from "../../middleware/auth";
import Product, { IProduct } from "../../models/Product";
import { UserRole } from "../../models/User";
import { VendingEvents } from "../../services/vending/types";
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
  [check("amount", "Please provide positive integer amount.").isInt({ gt: 0 })],
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
      if (req.userRole === UserRole.Vendor) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "Vendors are not allowed to use vending machine.",
            },
          ],
        });
      }

      const vendingMachineService = getCachedVendingMachine(req.userId);

      vendingMachineService.send(VendingEvents.Deposit, { value: amount });

      const cachedState = cacheVendingMachine(
        vendingMachineService,
        req.userId
      );

      res.json(cachedState.context);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

// @route   POST api/vending/reset
// @desc    Reset deposit to vending machine
// @access  Private
router.post("/reset", auth, async (req: Request, res: Response) => {
  try {
    if (req.userRole === UserRole.Vendor) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "Vendors are not allowed to use vending machine.",
          },
        ],
      });
    }

    const vendingMachineService = getCachedVendingMachine(req.userId);

    vendingMachineService.send(VendingEvents.Payout);

    const cachedState = cacheVendingMachine(vendingMachineService, req.userId);

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
      if (req.userRole === UserRole.Vendor) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "Vendors are not allowed to use vending machine.",
            },
          ],
        });
      }
      const product: IProduct = await Product.findById(productId);

      if (!product) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "Product not found.",
            },
          ],
        });
      }

      const vendingMachineService = getCachedVendingMachine(req.userId);

      vendingMachineService.send(VendingEvents.SelectItem, {
        item: product,
        quantity: amount,
      });

      vendingMachineService.onTransition((transition) => {
        if (transition.value === "idle") {
          const cachedState = cacheVendingMachine(
            vendingMachineService,
            req.userId
          );
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
// @desc    Get current deposit state
// @access  Private
router.get("/state", auth, async (req: Request, res: Response) => {
  try {
    if (req.userRole === UserRole.Vendor) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "Vendors are not allowed to use vending machine.",
          },
        ],
      });
    }

    const vendingMachineService = getCachedVendingMachine(req.userId);

    res.json(vendingMachineService.state);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export default router;
