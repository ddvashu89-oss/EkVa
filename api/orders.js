import { query, verifyAdminAuth } from "./db.js";

export default async function handler(req, res) {
  const method = req.method;

  if (method === "GET") {
    // Secure administrative endpoint
    if (!verifyAdminAuth(req, res)) return;

    try {
      const orders = await query("SELECT * FROM orders ORDER BY created_at DESC");
      return res.status(200).json({ status: "success", data: orders });
    } catch (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
  } else if (method === "POST") {
    // Public customer checkout endpoint
    const input = req.body;
    if (!input || !input.id || !input.productName || !input.name) {
      return res.status(400).json({ status: "error", message: "Missing required fields." });
    }

    try {
      const product_name = input.productName;
      const variant = input.variant || "";
      const quantity = parseInt(input.quantity) || 1;
      const name = input.name;
      const phone = input.phone || "";
      const address = input.address || "";
      const date = input.date || new Date().toLocaleDateString("en-IN");
      const bed = parseInt(input.bed) || 1;
      const status = input.status || "🌿 Bio-Bed Sourced";

      await query(
        `INSERT INTO orders (id, product_name, variant, quantity, name, phone, address, date, bed, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [input.id, product_name, variant, quantity, name, phone, address, date, bed, status]
      );

      return res.status(200).json({
        status: "success",
        message: "Order allocated successfully.",
        data: { id: input.id, product_name, variant, quantity, name, phone, address, date, bed, status }
      });
    } catch (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
  } else if (method === "DELETE") {
    // Secure administrative endpoint
    if (!verifyAdminAuth(req, res)) return;

    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ status: "error", message: "Order ID is required." });
    }

    try {
      await query("DELETE FROM orders WHERE id = ?", [id]);
      return res.status(200).json({ status: "success", message: "Order cancelled successfully." });
    } catch (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).json({ status: "error", message: `Method ${method} Not Allowed` });
  }
}
