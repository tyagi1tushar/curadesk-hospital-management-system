import axios from "axios";
import redisClient from "../config/redis.js";
import crypto from "crypto";

export const summarizeMedicalReport =
  async (
    reportText,
    userId
  ) => {

    try {

      const reportHash =
        crypto
          .createHash("sha256")
          .update(reportText)
          .digest("hex");

      const cacheKey =
        `summary:v2:${userId}:${reportHash}`;

      // CACHE CHECK
      const cached =
        await redisClient.get(
          cacheKey
        );

      if (cached) {

        console.log(
          "SUMMARY CACHE HIT"
        );

        return JSON.parse(
          cached
        );
      }

      console.log(
        "CALLING FASTAPI SUMMARY..."
      );

      const response =
        await axios.post(
          "http://localhost:8001/summarize",
          {
            text:
              reportText,
          }
        );

      const summary =
        response.data;

      // REDIS SAVE
      await redisClient.set(
        cacheKey,
        JSON.stringify(summary),
        "EX",
        86400
      );

      console.log(
        "FASTAPI SUMMARY SUCCESS"
      );

      return summary;

    } catch (err) {

      console.log(
        "FASTAPI SUMMARY ERROR:",
        err.message
      );

      return "Summary service unavailable.";
    }
  };