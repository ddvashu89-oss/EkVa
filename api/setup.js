import { query, verifyAdminAuth } from "./db.js";

export default async function handler(req, res) {
  // Secure administrative endpoint
  if (!verifyAdminAuth(req, res)) return;

  try {
    // 1. Seed Orders if empty
    const existingOrders = await query("SELECT COUNT(*) as count FROM orders");
    if (existingOrders[0].count === 0) {
      const sampleOrders = [
        {
          id: "EKV-784912",
          product_name: "Aadhar-Vati",
          variant: "1kg Refill Pouch (₹199)",
          quantity: 2,
          name: "Darshil Mehta",
          phone: "+91 98765 43210",
          address: "402 Green Meadows, Bandra West, Mumbai, MH - 400050",
          date: "17 May 2026",
          bed: 14,
          status: "🌿 Bio-Bed Sourced"
        },
        {
          id: "EKV-239104",
          product_name: "Aadhar-Vati Neem",
          variant: "5kg Bulk Bag (₹999)",
          quantity: 1,
          name: "Anjali Sharma",
          phone: "+91 99887 76655",
          address: "Flat 12B, Rosewood Apartments, Koramangala, Bengaluru, KA - 560034",
          date: "16 May 2026",
          bed: 42,
          status: "🌿 Bio-Bed Sourced"
        },
        {
          id: "EKV-901248",
          product_name: "Aadhar-Vati Coco",
          variant: "5kg Bulk Bag (₹899)",
          quantity: 3,
          name: "Rajesh Patel",
          phone: "+91 98223 34455",
          address: "A-104 Shanti Sadan, CG Road, Ahmedabad, GJ - 380009",
          date: "15 May 2026",
          bed: 29,
          status: "🌿 Bio-Bed Sourced"
        }
      ];

      for (const o of sampleOrders) {
        await query(
          `INSERT IGNORE INTO orders (id, product_name, variant, quantity, name, phone, address, date, bed, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [o.id, o.product_name, o.variant, o.quantity, o.name, o.phone, o.address, o.date, o.bed, o.status]
        );
      }
    }

    // 2. Seed Diagnoses if empty
    const existingDiagnoses = await query("SELECT COUNT(*) as count FROM diagnoses");
    if (existingDiagnoses[0].count === 0) {
      const greenPixelPhoto = "data:image/gif;base64,R0lGODlhAQABAIAAAAD/gAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
      const sampleDiagnoses = [
        {
          verdict: "needs-nutrients",
          cf: 91,
          ex: "Leaves show yellowing edges, highlighting a Pitta imbalance. At 31.4°C, metabolic oxidative stress is high.",
          tip: "Feed with Aadhar-Vati Pure compost to restore trace minerals and mist foliage at sunrise.",
          leaf_health: 45,
          hydration_score: 68,
          disease_risk: 38,
          vata: 30,
          pitta: 55,
          kapha: 15,
          temp: 31.4,
          humidity: 42.0,
          atmos: "Clear Sky",
          photo: greenPixelPhoto
        },
        {
          verdict: "needs-water",
          cf: 84,
          ex: "High Vata (dryness) detected. At 28.0% humidity, the transpiration rate is exceeding moisture uptake.",
          tip: "Water plant deeply using bottom-up watering and apply Aadhar-Vati Coco to retain moisture.",
          leaf_health: 38,
          hydration_score: 20,
          disease_risk: 15,
          vata: 65,
          pitta: 20,
          kapha: 15,
          temp: 29.5,
          humidity: 28.0,
          atmos: "Mainly Clear",
          photo: greenPixelPhoto
        },
        {
          verdict: "healthy",
          cf: 96,
          ex: "Vibrant cellular greenness. The plant elements (Vata, Pitta, Kapha) are in excellent harmony.",
          tip: "Keep up the regular care. Add 1 tablespoon of Aadhar-Vati monthly to maintain this state.",
          leaf_health: 92,
          hydration_score: 88,
          disease_risk: 5,
          vata: 33,
          pitta: 33,
          kapha: 34,
          temp: 26.2,
          humidity: 55.4,
          atmos: "Partly Cloudy",
          photo: greenPixelPhoto
        }
      ];

      for (const d of sampleDiagnoses) {
        await query(
          `INSERT INTO diagnoses (verdict, cf, ex, tip, leaf_health, hydration_score, disease_risk, vata, pitta, kapha, temp, humidity, atmos, photo)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [d.verdict, d.cf, d.ex, d.tip, d.leaf_health, d.hydration_score, d.disease_risk, d.vata, d.pitta, d.kapha, d.temp, d.humidity, d.atmos, d.photo]
        );
      }
    }

    // 3. Seed Messages if empty
    const existingMessages = await query("SELECT COUNT(*) as count FROM messages");
    if (existingMessages[0].count === 0) {
      const sampleMessages = [
        {
          name: "Darshil Mehta",
          email: "darshil@mehta.com",
          message: "Namaste! I tried your Aadhar-Vati Pure vermicompost and my home-grown rose bushes are blooming beautifully now. Is there any wholesale pricing if I buy 20 pouches at once for my terrace nursery?"
        },
        {
          name: "Dr. Sunita Rao (Greenwood School)",
          email: "principal@greenwoodhigh.edu.in",
          message: "We want to inaugurate a student-led organic garden at our middle school campus. Can we schedule an institutional site visit with your horticultural experts to discuss custom bio-bed installations?"
        },
        {
          name: "Prestige Heights Resident Welfare Association",
          email: "welfare@prestigeheightsrwa.org",
          message: "We are reviewing sustainable wet-waste management systems for our gated community of 350 families. Can you provide a detailed technical quote and composting capacity estimate for a commercial layout?"
        }
      ];

      for (const m of sampleMessages) {
        await query(
          "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)",
          [m.name, m.email, m.message]
        );
      }
    }

    // 4. Seed Reminders if empty
    const existingReminders = await query("SELECT COUNT(*) as count FROM reminders");
    if (existingReminders[0].count === 0) {
      const sampleReminders = [
        { plant_name: "Living Room Monstera", task_type: "water", frequency: "Daily", reminder_time: "08:00" },
        { plant_name: "Balcony Rose Shrub", task_type: "fertilize", frequency: "Weekly", reminder_time: "17:30" },
        { plant_name: "Study Fern Bonsai", task_type: "mist", frequency: "Every 3 Days", reminder_time: "12:00" }
      ];

      for (const r of sampleReminders) {
        await query(
          "INSERT INTO reminders (plant_name, task_type, frequency, reminder_time, is_enabled) VALUES (?, ?, ?, ?, 1)",
          [r.plant_name, r.task_type, r.frequency, r.reminder_time]
        );
      }
    }

    return res.status(200).json({
      status: "success",
      message: "Database initialized and populated with sample data successfully!"
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
}
