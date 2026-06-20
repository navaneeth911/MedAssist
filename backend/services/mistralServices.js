import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";



dotenv.config();
console.log("API Key Loaded:", process.env.MISTRAL_API_KEY?.slice(0, 10));

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export default mistral;