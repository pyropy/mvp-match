import { Router, Response } from "express";
import HttpStatusCodes from "http-status-codes";

import auth from "../../middleware/auth";
import Request from "../../types/Request";

const router: Router = Router();

// @route   GET api/product/add
// @desc    Add new product
// @access  Private
router.get("/add", auth, async (req: Request, res: Response) => {
  try {
    res.json({ test: 1 });
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});


export default router;
