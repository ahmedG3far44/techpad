import { Router } from "express";
import {
  addUserAddress,
  deleteUserAddress,
  deleteUserStatus,
  getUserAddressesList,
  getUserOrders,
  getUserProfile,
  login,
  register,
  setDefaultAddress,
  updateUserAddress,
  updateUserProfile,
  updateUserStatus,
} from "../services/userService";
import verifyToken from "../middlewares/verifyToken";
import { ExtendedRequest } from "../utils/types";
import verifyAdmin from "../middlewares/verifyAdmin";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const result = await register({ firstName, lastName, email, password });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login({ email, password });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

router.get("/profile", verifyToken, async (req: ExtendedRequest, res) => {
  try {
    const userId = req.user?.id!;
    const result = await getUserProfile({ userId });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

router.put("/profile", verifyToken, async (req: ExtendedRequest, res) => {
  try {
    const userId = req.user?.id!;
    const { firstName, lastName, phone, profileImage } = req.body;
    const result = await updateUserProfile({
      userId,
      firstName,
      lastName,
      phone,
      profileImage,
    });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

router.get("/orders", verifyToken, async (req: ExtendedRequest, res) => {
  try {
    const userId = req.user?.id!;
    const result = await getUserOrders({ userId });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

router.post("/address", verifyToken, async (req: ExtendedRequest, res) => {
  try {
    const userId = req.user?.id!;
    const address = req.body;
    const result = await addUserAddress({ userId, address });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

router.put("/address/:index", verifyToken, async (req: ExtendedRequest, res) => {
  try {
    const userId = req.user?.id!;
    const addressIndex = parseInt(req.params.index);
    const address = req.body;
    const result = await updateUserAddress({ userId, addressIndex, address });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

router.put("/address/:index/default", verifyToken, async (req: ExtendedRequest, res) => {
  try {
    const userId = req.user?.id!;
    const addressIndex = parseInt(req.params.index);
    const result = await setDefaultAddress({ userId, addressIndex });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

router.delete("/address/:index", verifyToken, async (req: ExtendedRequest, res) => {
  try {
    const userId = req.user?.id!;
    const addressIndex = parseInt(req.params.index);
    const result = await deleteUserAddress({ userId, addressIndex });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

router.get("/address", verifyToken, async (req: ExtendedRequest, res) => {
  try {
    const userId = req.user?.id!;
    const result = await getUserAddressesList({ userId });
    res.status(result.statusCode).json(result.data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
});

export default router;
