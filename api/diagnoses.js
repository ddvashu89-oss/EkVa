import { query, verifyAdminAuth } from "./db.js";

export default async function handler(req, res) {
  const method = req.method;

  if (method === "GET") {
    // Secure administrative endpoint
    if (!verifyAdminAuth(req, res)) return;

    try {
      const diagnoses = await query("SELECT * FROM diagnoses ORDER BY created_at DESC");
      return res.status(200).json({ status: "success", data: diagnoses });
    } catch (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
  } else if (method === "POST") {
    // Public doctor AI upload endpoint
    const input = req.body;
    if (!input || !input.verdict) {
      return res.status(400).json({ status: "error", message: "Missing required fields." });
    }

    try {
      const verdict = input.verdict;
      const cf = parseInt(input.cf) || 90;
      const ex = input.ex || "";
      const tip = input.tip || "";
      const leaf_health = parseInt(input.leaf_health) || 80;
      const hydration_score = parseInt(input.hydration_score) || 80;
      const disease_risk = parseInt(input.disease_risk) || 10;
      const vata = parseInt(input.vata) || 33;
      const pitta = parseInt(input.pitta) || 33;
      const kapha = parseInt(input.kapha) || 34;
      const temp = parseFloat(input.temp) || 28.5;
      const humidity = parseFloat(input.humidity) || 60.0;
      const atmos = input.atmos || "Clear Sky";
      const photo = input.photo || "";

      const result = await query(
        `INSERT INTO diagnoses (verdict, cf, ex, tip, leaf_health, hydration_score, disease_risk, vata, pitta, kapha, temp, humidity, atmos, photo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [verdict, cf, ex, tip, leaf_health, hydration_score, disease_risk, vata, pitta, kapha, temp, humidity, atmos, photo]
      );

      return res.status(200).json({
        status: "success",
        message: "Diagnosis saved successfully.",
        data: {
          id: result.insertId,
          verdict,
          cf,
          ex,
          tip,
          leaf_health,
          hydration_score,
          disease_risk,
          vata,
          pitta,
          kapha,
          temp,
          humidity,
          atmos,
          photo
        }
      });
    } catch (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ status: "error", message: `Method ${method} Not Allowed` });
  }
}
