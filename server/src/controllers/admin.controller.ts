import { Request, Response } from "express";
import orderModel from "../models/order";

export const getOrderCount = async (req: Request, res: Response) => {
  try {
    const counts = await orderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format response
    const formattedCounts = {
      PENDING: counts.find((c) => c._id === "PENDING")?.count || 0,
      SHIPPED: counts.find((c) => c._id === "SHIPPED")?.count || 0,
      DELIVERED: counts.find((c) => c._id === "DELIVERED")?.count || 0,
      CANCELLED: counts.find((c) => c._id === "CANCELLED")?.count || 0,
    };

    res.status(200).json(formattedCounts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order status counts" });
  }
};

export const getRevenueByTime = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { period } = req.params; // 'day', 'week', 'month', 'year'

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "day":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        res.status(400).json({ error: "Invalid period" });
        return;
    }

    const revenue = await orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: "CANCELLED" }, // Exclude cancelled orders
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalOrderPrice" },
        },
      },
    ]);

    res.status(200).json({
      period,
      totalRevenue: revenue[0]?.totalRevenue || 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch revenue" });
  }
};

export const getTopCustomers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const topCustomers = await orderModel.aggregate([
      {
        $group: {
          _id: "$userId",
          totalSpent: { $sum: "$totalOrderPrice" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } }, // Sort by highest spend
      { $limit: 10 }, // Top 10 customers
      {
        $lookup: {
          from: "users", // Assuming you have a User model
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userId: "$_id",
          name: "$user.name",
          email: "$user.email",
          profile: "$user.profile",
          totalSpent: 1,
          orderCount: 1,
        },
      },
    ]);

    res.status(200).json(topCustomers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch top customers" });
  }
};
