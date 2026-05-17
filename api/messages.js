import { query, verifyAdminAuth } from "./db.js";

export default async function handler(req, res) {
  const method = req.method;

  if (method === "GET") {
    // Secure administrative endpoint
    if (!verifyAdminAuth(req, res)) return;

    try {
      const messages = await query("SELECT * FROM messages ORDER BY created_at DESC");
      return res.status(200).json({ status: "success", data: messages });
    } catch (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
  } else if (method === "POST") {
    // Public contact form endpoint
    const input = req.body;
    if (!input || !input.name || !input.email || !input.message) {
      return res.status(400).json({ status: "error", message: "Missing required fields." });
    }

    try {
      const name = input.name;
      const email = input.email;
      const message = input.message;

      const result = await query(
        "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)",
        [name, email, message]
      );

      return res.status(200).json({
        status: "success",
        message: "Message delivered successfully.",
        data: { id: result.insertId, name, email, message }
      });
    } catch (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
  } else if (method === "DELETE") {
    // Secure administrative endpoint
    if (!verifyAdminAuth(req, res)) return;

    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ status: "error", message: "Message ID is required." });
    }

    try {
      await query("DELETE FROM messages WHERE id = ?", [id]);
      return res.status(200).json({ status: "success", message: "Message deleted successfully." });
    } catch (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).json({ status: "error", message: `Method ${method} Not Allowed` });
  }
}
