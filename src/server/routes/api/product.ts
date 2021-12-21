import { Router, Response } from "express";
import HttpStatusCodes from "http-status-codes";

import auth from "../../middleware/auth";
import Request from "../../types/Request";
import Product from "../../models/Product";
import { check, validationResult } from "express-validator/check";
import User, { IUser } from "../../models/User";

const router: Router = Router();

// @route   POST api/product/add
// @desc    Add new product
// @access  Private
router.post(
  "/add",
  [
    check("productName", "Product name is required.").isAlphanumeric(),
    check("cost", "Invalid cost, please provide positive decimal number.").isFloat({ gt: 0 }),
    check("amountAvailable", "Amount available must be positive number or zero.").isInt({ gt: -1 }),
  ],
  auth,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    try {
      const user: IUser = await User.findById(req.userId).select("-password");

      if (!user.vendor) {
        return res
          .status(HttpStatusCodes.BAD_REQUEST)
          .send("Only vendors are allowed to add products");
      }

      const { productName, cost, amountAvailable } = req.body;

      const productFields = {
        productName,
        cost,
        amountAvailable,
        sellerId: user.id,
      };

      const product = new Product(productFields);

      await product.save();

      res.json({ product });
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

// @route   GET api/product/all
// @desc    Get list of all products
// @access  Private
router.get("/all", auth, async (req: Request, res: Response) => {
  try {
    Product.find({}, (err, products) => {
      if (err) {
        return res
          .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
          .send("Server Error");
      }
      res.json({ products });
    });
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export default router;
