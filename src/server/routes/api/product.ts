import { Router, Response } from "express";
import HttpStatusCodes from "http-status-codes";

import auth from "../../middleware/auth";
import Request from "../../types/Request";
import Product from "../../models/Product";
import { check, validationResult } from "express-validator/check";
import User, { UserRole } from "../../models/User";

const router: Router = Router();

// @route   POST api/product/
// @desc    Add new product
// @access  Private
router.post(
  "/",
  [
    check("productName", "Product name is required.").isAlphanumeric(),
    check(
      "cost",
      "Invalid cost, please provide positive decimal number."
    ).isFloat({ gt: 0 }),
    check(
      "amountAvailable",
      "Amount available must be positive number or zero."
    ).isInt({ gt: -1 }),
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
      if (req.userRole !== UserRole.Vendor) {
        return res
          .status(HttpStatusCodes.BAD_REQUEST)
          .send("Only vendors are allowed to add products");
      }

      const { productName, cost, amountAvailable } = req.body;

      const productFields = {
        productName,
        cost,
        amountAvailable,
        sellerId: req.userId,
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

// @route   GET api/product/
// @desc    Get list of all products
// @access  Public
router.get("/", async (req: Request, res: Response) => {
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

// @route   PUT api/product/
// @desc    Update existing product
// @access  Private
router.put(
  "/",
  [check("productId", "Product id is required.").isAlphanumeric()],
  auth,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    try {
      if (req.userRole !== UserRole.Vendor) {
        return res
          .status(HttpStatusCodes.BAD_REQUEST)
          .send("Only vendors are allowed to add products");
      }
      const { productId, ...updateFields } = req.body;

      const product = await Product.findOneAndUpdate(
        { id: productId, sellerId: req.userId },
        updateFields,
        { returnOriginal: false }
      );

      if (!product) {
        return res
          .status(HttpStatusCodes.BAD_REQUEST)
          .send("Product not found.");
      }

      res.json({ product });
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

// @route   DELETE api/product/
// @desc    Delete existing product
// @access  Private
router.delete(
  "/",
  [check("productId", "Product id is required.").isAlphanumeric()],
  auth,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    try {
      if (req.userRole !== UserRole.Vendor) {
        return res
          .status(HttpStatusCodes.BAD_REQUEST)
          .send("Only vendors are allowed to add products");
      }
      const { productId } = req.body;

      const product = await Product.findOneAndDelete({
        id: productId,
        sellerId: req.userId,
      });

      if (!product) {
        return res
          .status(HttpStatusCodes.BAD_REQUEST)
          .send("Product not found.");
      }

      res.json({ product });
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

export default router;
