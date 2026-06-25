// routes/hospitalRoutes.js

import express from "express";

const router = express.Router();

router.get("/nearby-hospitals", async (req, res) => {
  const { lat, lng } = req.query;

  const query = `
  [out:json];
  (
    node["amenity"="hospital"](around:5000,${lat},${lng});
    way["amenity"="hospital"](around:5000,${lat},${lng});
    relation["amenity"="hospital"](around:5000,${lat},${lng});
  );
  out center;
  `;

  try {
    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
          "User-Agent":
            "MedAssist AI Hospital Finder",
        },
        body: `data=${encodeURIComponent(query)}`,
      }
    );

    const data = await response.json();

    res.json(data.elements);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;