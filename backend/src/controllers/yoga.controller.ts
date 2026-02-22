import { type AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { type Response } from "express";
import yoga from "../../data/yoga.json" with { type: "json" };
import { yogaInfo } from "../utils/yoga.js";

export const getYoga = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { query }: { query: string } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Pose Name or Symptom is required"
      });
    }

    const search = query.charAt(0).toUpperCase() + query.slice(1);
    const match = yoga.find((s: any) => s.target_benefit.toLowerCase().includes(search));

    if (match) {
      return res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        data: match
      });
    }

    const result = await yogaInfo(query);
    
    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: result
    });
  } catch (error) {
    console.error("Error in fetching yoga information :- ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}