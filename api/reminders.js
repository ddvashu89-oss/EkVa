import { query } from "./db.js";

export default async function handler(req, res) {
  const method = req.method;

  if (method === "GET") {
    try {
      const reminders = await query("SELECT * FROM reminders ORDER BY created_at DESC");
      return res.status(200).json({ status: "success", data: reminders });
    } catch (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
  } else if (method === "POST") {
    const input = req.body;
    if (!input || !input.plant_name || !input.task_type || !input.frequency || !input.reminder_time) {
      return res.status(400).json({ status: "error", message: "Missing required fields." });
    }

    try {
      const plant_name = input.plant_name;
      const task_type = input.task_type;
      const frequency = input.frequency;
      const reminder_time = input.reminder_time;

      const result = await query(
        `INSERT INTO reminders (plant_name, task_type, frequency, reminder_time, is_enabled)
         VALUES (?, ?, ?, ?, 1)`,
        [plant_name, task_type, frequency, reminder_time]
      );

      return res.status(200).json({
        status: "success",
        message: "Reminder scheduled successfully.",
        data: { id: result.insertId, plant_name, task_type, frequency, reminder_time, is_enabled: 1 }
      });
    } catch (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
  } else if (method === "PUT") {
    const input = req.body;
    if (!input || !input.id || input.is_enabled === undefined) {
      return res.status(400).json({ status: "error", message: "Missing required fields." });
    }

    try {
      const id = input.id;
      const is_enabled = parseInt(input.is_enabled);

      await query("UPDATE reminders SET is_enabled = ? WHERE id = ?", [is_enabled, id]);
      return res.status(200).json({ status: "success", message: "Reminder state toggled successfully." });
    } catch (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
  } else if (method === "DELETE") {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ status: "error", message: "Reminder ID is required." });
    }

    try {
      await query("DELETE FROM reminders WHERE id = ?", [id]);
      return res.status(200).json({ status: "success", message: "Reminder deleted successfully." });
    } catch (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ status: "error", message: `Method ${method} Not Allowed` });
  }
}
