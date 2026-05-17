import { collection, doc, setDoc, addDoc, getDocs } from "firebase/firestore";
import { db, verifyAdminAuth } from "./db.js";

export default async function handler(req, res) {
  // Secure administrative endpoint
  if (!verifyAdminAuth(req, res)) return;

  try {
    // 1. Seed Orders if empty
    const ordersCol = collection(db, "orders");
    const ordersSnap = await getDocs(ordersCol);
    if (ordersSnap.size === 0) {
      const sampleOrders = [
        {
          id: 'EKV-784912',
          product_name: 'Aadhar-Vati',
          variant: '1kg Refill Pouch (₹199)',
          quantity: 2,
          name: 'Darshil Mehta',
          phone: '+91 98765 43210',
          address: '402 Green Meadows, Bandra West, Mumbai, MH - 400050',
          date: '17 May 2026',
          bed: 14,
          status: '🌿 Bio-Bed Sourced',
          created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
        },
        {
          id: 'EKV-239104',
          product_name: 'Aadhar-Vati Neem',
          variant: '5kg Bulk Bag (₹999)',
          quantity: 1,
          name: 'Anjali Sharma',
          phone: '+91 99887 76655',
          address: 'Flat 12B, Rosewood Apartments, Koramangala, Bengaluru, KA - 560034',
          date: '16 May 2026',
          bed: 42,
          status: '🌿 Bio-Bed Sourced',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
        },
        {
          id: 'EKV-901248',
          product_name: 'Aadhar-Vati Coco',
          variant: '5kg Bulk Bag (₹899)',
          quantity: 3,
          name: 'Rajesh Patel',
          phone: '+91 98223 34455',
          address: 'A-104 Shanti Sadan, CG Road, Ahmedabad, GJ - 380009',
          date: '15 May 2026',
          bed: 29,
          status: '🌿 Bio-Bed Sourced',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() // 2 days ago
        }
      ];

      for (const o of sampleOrders) {
        const orderRef = doc(db, "orders", o.id);
        const { id, ...data } = o;
        await setDoc(orderRef, data);
      }
    }

    // 2. Seed Diagnoses if empty
    const diagnosesCol = collection(db, "diagnoses");
    const diagnosesSnap = await getDocs(diagnosesCol);
    if (diagnosesSnap.size === 0) {
      const greenPixelPhoto = "data:image/gif;base64,R0lGODlhAQABAIAAAAD/gAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
      const sampleDiagnoses = [
        {
          id: Date.now() - 3600000,
          verdict: 'needs-nutrients',
          cf: 91,
          ex: 'Leaves show yellowing edges, highlighting a Pitta imbalance. At 31.4°C, metabolic oxidative stress is high.',
          tip: 'Feed with Aadhar-Vati Pure compost to restore trace minerals and mist foliage at sunrise.',
          leaf_health: 45,
          hydration_score: 68,
          disease_risk: 38,
          vata: 30,
          pitta: 55,
          kapha: 15,
          temp: 31.4,
          humidity: 42.0,
          atmos: 'Clear Sky',
          photo: greenPixelPhoto,
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: Date.now() - 86400000,
          verdict: 'needs-water',
          cf: 84,
          ex: 'High Vata (dryness) detected. At 28.0% humidity, the transpiration rate is exceeding moisture uptake.',
          tip: 'Water plant deeply using bottom-up watering and apply Aadhar-Vati Coco to retain moisture.',
          leaf_health: 38,
          hydration_score: 20,
          disease_risk: 15,
          vata: 65,
          pitta: 20,
          kapha: 15,
          temp: 29.5,
          humidity: 28.0,
          atmos: 'Mainly Clear',
          photo: greenPixelPhoto,
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: Date.now() - 172800000,
          verdict: 'healthy',
          cf: 96,
          ex: "Vibrant cellular greenness. The plant's three elements (Vata, Pitta, Kapha) are in excellent harmony.",
          tip: 'Keep up the regular care. Add 1 tablespoon of Aadhar-Vati monthly to maintain this state.',
          leaf_health: 92,
          hydration_score: 88,
          disease_risk: 5,
          vata: 33,
          pitta: 33,
          kapha: 34,
          temp: 26.2,
          humidity: 55.4,
          atmos: 'Partly Cloudy',
          photo: greenPixelPhoto,
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];

      for (const d of sampleDiagnoses) {
        await addDoc(diagnosesCol, d);
      }
    }

    // 3. Seed Messages if empty
    const messagesCol = collection(db, "messages");
    const messagesSnap = await getDocs(messagesCol);
    if (messagesSnap.size === 0) {
      const sampleMessages = [
        {
          name: 'Darshil Mehta',
          email: 'darshil@mehta.com',
          message: 'Namaste! I tried your Aadhar-Vati Pure vermicompost and my home-grown rose bushes are blooming beautifully now. Is there any wholesale pricing if I buy 20 pouches at once for my terrace nursery?',
          created_at: new Date(Date.now() - 1000000).toISOString()
        },
        {
          name: 'Dr. Sunita Rao (Greenwood School)',
          email: 'principal@greenwoodhigh.edu.in',
          message: 'We want to inaugurate a student-led organic garden at our middle school campus. Can we schedule an institutional site visit with your horticultural experts to discuss custom bio-bed installations?',
          created_at: new Date(Date.now() - 2000000).toISOString()
        },
        {
          name: 'Prestige Heights Resident Welfare Association',
          email: 'welfare@prestigeheightsrwa.org',
          message: 'We are reviewing sustainable wet-waste management systems for our gated community of 350 families. Can you provide a detailed technical quote and composting capacity estimate for a commercial layout?',
          created_at: new Date(Date.now() - 3000000).toISOString()
        }
      ];

      for (const m of sampleMessages) {
        await addDoc(messagesCol, m);
      }
    }

    // 4. Seed Reminders if empty
    const remindersCol = collection(db, "reminders");
    const remindersSnap = await getDocs(remindersCol);
    if (remindersSnap.size === 0) {
      const sampleReminders = [
        {
          plant_name: 'Living Room Monstera',
          task_type: 'water',
          frequency: 'Daily',
          reminder_time: '08:00',
          is_enabled: 1,
          created_at: new Date(Date.now() - 5000000).toISOString()
        },
        {
          plant_name: 'Balcony Rose Shrub',
          task_type: 'fertilize',
          frequency: 'Weekly',
          reminder_time: '17:30',
          is_enabled: 1,
          created_at: new Date(Date.now() - 6000000).toISOString()
        },
        {
          plant_name: 'Study Fern Bonsai',
          task_type: 'mist',
          frequency: 'Every 3 Days',
          reminder_time: '12:00',
          is_enabled: 1,
          created_at: new Date(Date.now() - 7000000).toISOString()
        }
      ];

      for (const r of sampleReminders) {
        await addDoc(remindersCol, r);
      }
    }

    return res.status(200).json({
      status: "success",
      message: "Database schema initialized and populated with high-fidelity sample data successfully!"
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
}
