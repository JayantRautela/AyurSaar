import { type AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { type Response } from "express";
import { getherbInfo } from "../utils/herbs.js";
import herbs from "../../data/herbs.json" with { type: "json" };

export const searchHerb = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { query }: { query: string } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Herb Name is required"
      });
    }

    const search = query.charAt(0).toUpperCase() + query.slice(1);
    const match = herbs.find((s: any) => s.name === search);

    if (match) {
      return res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        data: match
      });
    }

    const result = await getherbInfo(query);

    console.log(result)
    
    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: result
    });
  } catch (error) {
    console.error("Error in fetching herb information :- ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}