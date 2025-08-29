import { sb } from "@/libs/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Todo 'id' is required." });
  }

  if (req.method === "GET") {
    try {
      const { data, error } = await sb.from("Todos").select().eq("id", id).single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err||"Failed to fetch data" });
    }
  } else if (req.method === "PATCH") {
    try {
      const { text, completed } = req.body;
      const { data, error } = await sb
        .from("Todos")
        .update({ text, completed })
        .eq("id", id)
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ error: err||"Failed to update todo" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { data, error } = await sb.from("Todos").delete().eq("id", id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ error: err||"Failed to delete todo" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}