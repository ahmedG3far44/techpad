import { Router } from "express";
import { ExtendedRequest } from "../utils/types";
import { getSettings, updateSettings } from "../services/storeSettingsService";
import verifyToken from "../middlewares/verifyToken";
import verifyAdmin from "../middlewares/verifyAdmin";

const router = Router();

router.get("/settings", async (req, res) => {
  try {
    const result = await getSettings();
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

router.put("/admin/settings", verifyToken, verifyAdmin, async (req: ExtendedRequest, res) => {
  try {
    const { country, currencyCode, currencySymbol, exchangeRate } = req.body;
    if (!country || !currencyCode || !currencySymbol || exchangeRate == null) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const result = await updateSettings({
      country,
      currencyCode,
      currencySymbol,
      exchangeRate: parseFloat(exchangeRate),
    });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

export default router;
