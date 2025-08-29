
import { sb } from "@/libs/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { data, error } = await sb.from("Todos").select("*");
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: error||"error try again" });
    }
  } else if (req.method === "POST") {
    try {
      const { text, completed = false } = req.body;
      if (!text) {
        return res.status(400).json({ error: "'text' is required." });
      }
      const { data, error } = await sb.from("Todos").insert([{ text, completed }]).select().single();
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(201).json(data);
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


