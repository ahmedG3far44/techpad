import express from "express";
import upload from "../configs/multer";
import { uploadMultipleToCloudinary } from "../utils/cloudinary";
import { ExtendedRequest } from "../utils/types";

const router = express.Router();

router.post(
  "/",
  upload.array("image", 5),
  async (req: ExtendedRequest, res) => {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json({ error: "No files provided" });
        return;
      }

      const imagesUrl = await uploadMultipleToCloudinary(files, "products");

      res.status(201).json({ images: imagesUrl });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
