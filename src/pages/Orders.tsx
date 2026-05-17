import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Order {
  id: string;
  productName: string;
  variant: string;
  quantity: number;
  name: string;
  phone: string;
  address: string;
  date: string;
  bed: number;
  status: string;
}

interface Reminder {
  id?: number;
  plant_name: string;
  task_type: string; // 'water', 'fertilize', 'mist', 'aerate'
  frequency: string; // 'Daily', 'Every 3 Days', 'Weekly'
  reminder_time: string; // 'HH:MM'
  is_enabled: number; // 0 | 1
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [dbConnected, setDbConnected] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [plantName, setPlantName] = useState("");
  const [taskType, setTaskType] = useState("water");
  const [frequency, setFrequency] = useState("Daily");
  const [reminderTime, setReminderTime] = useState("08:00");
  const [submittingRem, setSubmittingRem] = useState(false);

  // Browser Permission State
  const [notiPermission, setNotiPermission] = useState("default");

  // Active Alert Trigger State
  const [activeAlert, setActiveAlert] = useState<Reminder | null>(null);
  const [lastTriggeredTime, setLastTriggeredTime] = useState("");

  // Sound synthesis using Web Audio API (Harmonic A-Major Zen Temple Bell)
  const playZenBell = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const playHarmonic = (freq: number, gainVal: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(gainVal, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
      };
      
      // Multi-harmonic bell synthesis
      playHarmonic(440, 0.35, 3.0);   // Root Tone
      playHarmonic(554.37, 0.18, 2.5); // Major Third (C#)
      playHarmonic(659.25, 0.18, 2.2); // Perfect Fifth (E)
      playHarmonic(880, 0.12, 1.8);    // Octave (A)
    } catch (e) {
      console.warn("Web Audio API not allowed or failed to init:", e);
    }
  };

  // Load orders and reminders
  const loadDashboardData = async () => {
    // 1. Load Orders
    const existing = localStorage.getItem("ekva_orders");
    if (existing) {
      setOrders(JSON.parse(existing));
    }

    // 2. Load Reminders from Database
    try {
      const res = await fetch("/api/reminders.php");
      if (!res.ok) throw new Error("Reminders API unreachable");
      const json = await res.json();
      if (json.status === "success") {
        setReminders(json.data);
        setDbConnected(true);
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      console.warn("Reminders DB offline. Using local storage fallback.", err);
      setDbConnected(false);
      const localRem = localStorage.getItem("ekva_reminders");
      if (localRem) {
        setReminders(JSON.parse(localRem));
      } else {
        // Initial offline default samples
        const sampleRem = [
          {
            id: 101,
            plant_name: "Living Room Monstera",
            task_type: "water",
            frequency: "Daily",
            reminder_time: "08:00",
            is_enabled: 1
          },
          {
            id: 102,
            plant_name: "Balcony Rose Shrub",
            task_type: "fertilize",
            frequency: "Weekly",
            reminder_time: "17:30",
            is_enabled: 1
          }
        ];
        setReminders(sampleRem);
        localStorage.setItem("ekva_reminders", JSON.stringify(sampleRem));
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && typeof Notification !== "undefined") {
      setNotiPermission(Notification.permission);
    }
    loadDashboardData();
  }, []);

  // Request browser Notification Permission
  const handleRequestNotiPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotiPermission(permission);
  };

  // Poll clock to trigger active reminders
  useEffect(() => {
    if (!mounted || reminders.length === 0) return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const currentTime = `${hh}:${mm}`;

      // Prevent multiple triggers during the same minute
      if (currentTime === lastTriggeredTime) return;

      const activeAlarms = reminders.filter(
        (r) => r.is_enabled === 1 && r.reminder_time === currentTime
      );

      if (activeAlarms.length > 0) {
        setLastTriggeredTime(currentTime);
        const triggeredAlarm = activeAlarms[0];
        
        // Trigger sound alert
        playZenBell();
        
        // Show visual alert
        setActiveAlert(triggeredAlarm);

        // Show push notification
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification(`🌿 Ekva Plant Doctor Alert!`, {
            body: `Time to ${triggeredAlarm.task_type} your "${triggeredAlarm.plant_name}"!`,
            icon: "/favicon.ico"
          });
        }
      }
    }, 15000); // Check every 15s

    return () => clearInterval(checkInterval);
  }, [mounted, reminders, lastTriggeredTime]);

  // Cancel order
  function handleCancelOrder(id: string) {
    const updated = orders.filter((o) => o.id !== id);
    localStorage.setItem("ekva_orders", JSON.stringify(updated));
    setOrders(updated);
  }

  // Create Reminder
  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantName.trim()) return;
    setSubmittingRem(true);

    const newReminderData = {
      plant_name: plantName,
      task_type: taskType,
      frequency: frequency,
      reminder_time: reminderTime
    };

    if (dbConnected) {
      try {
        const res = await fetch("/api/reminders.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReminderData)
        });
        if (!res.ok) throw new Error("Reminders post failed");
        
        setPlantName("");
        loadDashboardData();
      } catch (err) {
        alert("Database connection failed. Creating offline schedule fallback instead.");
      }
    } else {
      // Offline fallback storage
      const newRem: Reminder = {
        id: Date.now(),
        plant_name: plantName,
        task_type: taskType,
        frequency: frequency,
        reminder_time: reminderTime,
        is_enabled: 1
      };
      const updated = [newRem, ...reminders];
      setReminders(updated);
      localStorage.setItem("ekva_reminders", JSON.stringify(updated));
      setPlantName("");
    }
    setSubmittingRem(false);
  };

  // Toggle Reminder Enable Switch
  const handleToggleReminder = async (id: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    if (dbConnected) {
      try {
        const res = await fetch("/api/reminders.php", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: id, is_enabled: newStatus })
        });
        if (!res.ok) throw new Error("Reminder toggle API failed");
        loadDashboardData();
      } catch (err) {
        console.error(err);
      }
    } else {
      // Offline local mapping
      const updated = reminders.map((r) =>
        r.id === id ? { ...r, is_enabled: newStatus } : r
      );
      setReminders(updated);
      localStorage.setItem("ekva_reminders", JSON.stringify(updated));
    }
  };

  // Delete Reminder
  const handleDeleteReminder = async (id: number) => {
    if (dbConnected) {
      try {
        const res = await fetch(`/api/reminders.php?id=${id}`, {
          method: "DELETE"
        });
        if (!res.ok) throw new Error("Reminder deletion API failed");
        loadDashboardData();
      } catch (err) {
        console.error(err);
      }
    } else {
      // Offline deletion mapping
      const updated = reminders.filter((r) => r.id !== id);
      setReminders(updated);
      localStorage.setItem("ekva_reminders", JSON.stringify(updated));
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-charcoal text-sand flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-gold/60">Aligning Sourced Bio-Beds...</p>
        </div>
      </div>
    );
  }

  const totalBeds = Array.from(new Set(orders.map((o) => o.bed))).length;
  const totalQty = orders.reduce((sum, o) => sum + o.quantity, 0);

  // Advice helper for matching reminders
  const getCareAdvice = (type: string) => {
    switch (type) {
      case "water":
        return "Best watered early morning or at sunset. Apply bottom-up watering until soil Peat Moss is thoroughly moist.";
      case "fertilize":
        return "Feed with Aadhar-Vati compost. Sprinkle 2 tbsp around base and work gently into top 1 inch of soil.";
      case "mist":
        return "Increases relative ambient humidity. Mist leaf undersides to prevent cellular transpiration dehydration.";
      case "aerate":
        return "Rotate plant 90° for uniform sunlight and use a wooden rod to aerate soil to boost root respiration.";
      default:
        return "Maintain regular observations and clean yellowing trace spots.";
    }
  };

  return (
    <div className="min-h-screen bg-charcoal text-sand pt-32 pb-20 relative">
      
      {/* 🔔 FLOATING ACTIVE REMINDER MODAL BANNER */}
      {activeAlert && (
        <div className="fixed inset-x-6 top-8 z-50 max-w-lg mx-auto border-2 border-gold rounded-2xl bg-charcoal/95 backdrop-blur-md shadow-2xl p-6 space-y-4 select-none animate-slideDown">
          
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-bounce">🔔</span>
              <div>
                <p className="font-serif text-cream text-lg font-bold">Plant Wellness Time!</p>
                <p className="text-[10px] text-gold uppercase tracking-wider font-mono mt-0.5">Automated Active Schedule</p>
              </div>
            </div>
            
            <button 
              onClick={() => setActiveAlert(null)}
              className="text-sand/50 hover:text-gold text-xs font-bold border border-moss/30 hover:border-gold/30 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer transition-all"
            >
              ✕
            </button>
          </div>

          <div className="border border-moss/20 rounded-xl p-4 bg-moss/5 space-y-1">
            <p className="text-sm text-cream font-medium">
              It is time to <strong className="text-gold uppercase">{activeAlert.task_type}</strong> your plant specimen <strong className="italic">&ldquo;{activeAlert.plant_name}&rdquo;</strong>!
            </p>
            <p className="text-xs text-sand/50 italic leading-relaxed pt-2 border-t border-moss/10 mt-2">
              💡 <strong>Botanical Tip:</strong> {getCareAdvice(activeAlert.task_type)}
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                setActiveAlert(null);
                playZenBell();
              }}
              className="bg-gold/10 border border-gold/40 text-gold hover:bg-gold/25 px-5 py-2 rounded-full text-xs uppercase tracking-wider font-bold cursor-pointer"
            >
              ✓ Completed Task
            </button>
          </div>

        </div>
      )}

      <div className="mx-auto max-w-6xl px-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gold/60 font-serif">Unified Wellness Hub</span>
            <h1 className="font-serif text-4xl md:text-5xl text-cream mt-2">My Soil Allocations</h1>
            <p className="text-sand/50 text-xs md:text-sm mt-2 max-w-lg leading-relaxed">
              Trace your living soil bags straight back to our vermicompost beds and schedule automatic botanical alarms to care for your plant family.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest bg-gold/15 border border-gold/40 text-gold hover:bg-gold/25 px-6 py-3 rounded-full transition-all self-start md:self-auto"
          >
            🌱 Order More Soil
          </Link>
        </div>

        {/* ── SECTION 1: MY SOIL ALLOCATIONS ── */}
        {orders.length > 0 ? (
          <div className="space-y-8">
            {/* Stats Dashboard */}
            <div className="grid grid-cols-3 gap-4 border border-moss/30 rounded-2xl p-6 bg-moss/5 backdrop-blur-sm">
              <div className="text-center border-r border-moss/20">
                <p className="text-xs uppercase tracking-wider text-sand/30 mb-1">Total Batches</p>
                <p className="text-2xl md:text-3xl font-serif font-bold text-gold">{orders.length}</p>
              </div>
              <div className="text-center border-r border-moss/20">
                <p className="text-xs uppercase tracking-wider text-sand/30 mb-1">Active Bio-Beds</p>
                <p className="text-2xl md:text-3xl font-serif font-bold text-gold">{totalBeds}</p>
              </div>
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-sand/30 mb-1">Total Quantity</p>
                <p className="text-2xl md:text-3xl font-serif font-bold text-gold">{totalQty} Bags</p>
              </div>
            </div>

            {/* Orders List Grid */}
            <div className="grid grid-cols-1 gap-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-moss/30 hover:border-gold/20 rounded-2xl p-6 bg-moss/5 relative overflow-hidden transition-all grid grid-cols-1 lg:grid-cols-12 gap-6 shadow-xl"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.02] rounded-full blur-2xl pointer-events-none" />

                  {/* LEFT: Product Summary & Tracking (Span 5) */}
                  <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-moss/20 pb-6 lg:pb-0 lg:pr-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-mono tracking-widest text-gold bg-gold/10 px-3 py-1 rounded-full uppercase">
                          {order.id}
                        </span>
                        <span className="text-xs text-sand/40">{order.date}</span>
                      </div>
                      
                      <h3 className="font-serif text-xl text-cream">{order.productName}</h3>
                      <p className="text-xs text-sand/50 mt-1 italic font-serif">Variant: {order.variant.split(" (")[0]}</p>
                      
                      <div className="mt-4 flex gap-4 text-xs">
                        <div>
                          <span className="text-sand/30 block">Qty</span>
                          <span className="text-cream font-mono font-bold">{order.quantity} Bags</span>
                        </div>
                        <div>
                          <span className="text-sand/30 block">Allocated Source</span>
                          <span className="text-gold font-bold">Bio-Bed #{order.bed}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(order.id)}
                        className="text-[10px] uppercase tracking-wider text-terracotta hover:text-red-400 border border-terracotta/20 hover:border-terracotta rounded-full px-4 py-2 transition-all cursor-pointer font-bold"
                      >
                        Cancel Allocation
                      </button>
                    </div>
                  </div>

                  {/* MIDDLE: Sourced Bed Traceability Details (Span 4) */}
                  <div className="lg:col-span-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-moss/20 pb-6 lg:pb-0 lg:pr-6">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-gold/60 font-semibold block mb-2">🌿 Oneness Traceability</span>
                      <p className="text-xs text-sand/40 leading-relaxed">
                        This batch is triple-sieved and allocated from our organic <strong>Vermicompost Bio-Bed #{order.bed}</strong>. Feed logs show rich earthworm cultivation and natural bio-enzymatic aeration.
                      </p>
                    </div>

                    {/* Sourced Bed tracker progress bars */}
                    <div className="mt-4 space-y-2.5">
                      <span className="text-[9px] uppercase tracking-wider text-sand/30 block">Harvest Process Stages</span>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gold font-bold">Sourced ✓</span>
                        <span className="text-gold font-bold">Sieved ✓</span>
                        <span className="text-sand/50">Packed ✓</span>
                      </div>
                      <div className="h-1.5 w-full bg-charcoal rounded-full overflow-hidden border border-moss/20 flex gap-0.5">
                        <div className="h-full bg-gold flex-1" />
                        <div className="h-full bg-gold flex-1" />
                        <div className="h-full bg-gold flex-1" />
                        <div className="h-full bg-moss/25 flex-1" />
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Delivery Recipient (Span 3) */}
                  <div className="lg:col-span-3 flex flex-col justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-sand/40 block mb-2">Recipient Info</span>
                      <p className="text-sm text-cream font-medium">{order.name}</p>
                      <p className="text-xs text-sand/50 mt-1 font-mono">{order.phone}</p>
                      <p className="text-xs text-sand/40 mt-3 leading-relaxed border-t border-moss/10 pt-2">{order.address}</p>
                    </div>

                    <div className="text-[10px] text-moss font-semibold uppercase tracking-wider mt-4 flex items-center gap-1.5 font-bold">
                      <span className="w-2 h-2 bg-moss rounded-full animate-ping shrink-0" />
                      <span>{order.status}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty state block */
          <div className="border border-dashed border-moss/30 rounded-2xl p-16 text-center text-sand/40 bg-moss/5">
            <svg className="w-16 h-16 mx-auto mb-6 opacity-30 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="font-serif text-2xl text-cream mb-2">No Soil Allocations Found</h3>
            <p className="text-xs max-w-md mx-auto leading-relaxed mb-8">
              You haven&rsquo;t placed any compost orders yet. Allocate a batch of premium living soil from our beds to kickstart your plant wellness journey.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold hover:bg-gold/25 px-8 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all cursor-pointer font-bold"
            >
              Explore Products Range
            </Link>
          </div>
        )}

        {/* ── SECTION SPACER ── */}
        <div className="border-t border-moss/20 my-16" />

        {/* ── SECTION 2: AUTOMATIC PLANT CARE REMINDERS ── */}
        <div>
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-gold/60 font-serif">Alarms &amp; Chronology</span>
              <h2 className="font-serif text-3xl text-cream mt-1">Automatic Care Alarms</h2>
              <p className="text-sand/50 text-xs md:text-sm mt-1 max-w-lg leading-relaxed">
                Schedule dynamic browser alerts that play soothing temple chimes and send desktop notifications to ensure your plants are misted, fed, and watered precisely.
              </p>
            </div>

            {/* Notification Permission Toggle */}
            <button
              onClick={handleRequestNotiPermission}
              className={`text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full border transition-all cursor-pointer shrink-0 ${
                notiPermission === "granted"
                  ? "border-green-800/40 text-green-400 bg-green-950/10"
                  : notiPermission === "denied"
                  ? "border-terracotta/40 text-terracotta bg-terracotta/[0.04]"
                  : "border-gold/30 text-gold hover:bg-gold/10"
              }`}
            >
              {notiPermission === "granted"
                ? "🔔 Desktop Notifications: Active"
                : notiPermission === "denied"
                ? "🔕 Notifications: Blocked"
                : "🔔 Enable Desktop Push Notifications"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: SCHEDULE ALARM FORM (Span 5) */}
            <div className="lg:col-span-5 border border-moss/30 rounded-2xl p-6 bg-moss/5 backdrop-blur-sm self-start">
              <h3 className="font-serif text-lg text-cream mb-5">Set Care Alarm</h3>
              
              <form onSubmit={handleCreateReminder} className="space-y-4">
                
                {/* Plant Name input */}
                <div>
                  <label htmlFor="plant" className="block text-[10px] uppercase tracking-wider text-sand/40 mb-1.5">
                    Plant Specimen Name
                  </label>
                  <input
                    id="plant"
                    type="text"
                    required
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    placeholder="e.g. Balcony Monstera, Fern, Aloe"
                    className="w-full bg-charcoal border border-moss/30 rounded-xl px-4 py-2.5 text-xs text-sand placeholder-sand/20 focus:outline-none focus:border-gold/40 transition-colors"
                  />
                </div>

                {/* Task selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="task" className="block text-[10px] uppercase tracking-wider text-sand/40 mb-1.5">
                      Care Task
                    </label>
                    <select
                      id="task"
                      value={taskType}
                      onChange={(e) => setTaskType(e.target.value)}
                      className="w-full bg-charcoal border border-moss/30 rounded-xl px-3 py-2.5 text-xs text-sand focus:outline-none focus:border-gold/40 transition-colors cursor-pointer"
                    >
                      <option value="water">💧 Water Soil</option>
                      <option value="fertilize">🌿 Feed Compost</option>
                      <option value="mist">💨 Foliage Mist</option>
                      <option value="aerate">🪵 Soil Aeration</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="freq" className="block text-[10px] uppercase tracking-wider text-sand/40 mb-1.5">
                      Frequency
                    </label>
                    <select
                      id="freq"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full bg-charcoal border border-moss/30 rounded-xl px-3 py-2.5 text-xs text-sand focus:outline-none focus:border-gold/40 transition-colors cursor-pointer"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Every 3 Days">Every 3 Days</option>
                      <option value="Weekly">Weekly</option>
                    </select>
                  </div>
                </div>

                {/* Time Picker */}
                <div>
                  <label htmlFor="time" className="block text-[10px] uppercase tracking-wider text-sand/40 mb-1.5">
                    Trigger Alarm Time (HH:MM)
                  </label>
                  <input
                    id="time"
                    type="time"
                    required
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full bg-charcoal border border-moss/30 rounded-xl px-4 py-2.5 text-xs text-sand focus:outline-none focus:border-gold/40 transition-colors cursor-pointer font-mono font-bold"
                  />
                </div>

                {/* Action Submit */}
                <button
                  type="submit"
                  disabled={submittingRem}
                  className="w-full bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 disabled:opacity-50 px-5 py-3 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer font-bold mt-2"
                >
                  {submittingRem ? "Scheduling..." : "➕ Add Alarm Schedule"}
                </button>

              </form>
            </div>

            {/* RIGHT COLUMN: ACTIVE REMINDERS LIST (Span 7) */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="flex items-center justify-between border-b border-moss/30 pb-3">
                <h3 className="font-serif text-lg text-cream">Active Schedule Alarms</h3>
                <span className="text-[10px] text-sand/40 font-mono">
                  Database Sync: <strong className={dbConnected ? "text-green-500 font-bold" : "text-gold font-bold"}>
                    {dbConnected ? "Live MySQL" : "Local Fallback"}
                  </strong>
                </span>
              </div>

              {reminders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reminders.map((r) => (
                    <div
                      key={r.id}
                      className={`border rounded-2xl p-4 bg-moss/5 backdrop-blur-sm flex flex-col justify-between transition-all select-none ${
                        r.is_enabled === 1
                          ? "border-moss/30 hover:border-gold/20"
                          : "border-moss/10 opacity-50"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          {/* Task Badge */}
                          <span className={`inline-flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-mono border rounded-full px-2.5 py-0.5 ${
                            r.task_type === "water"
                              ? "border-blue-800/40 text-blue-400 bg-blue-950/10"
                              : r.task_type === "fertilize"
                              ? "border-green-800/40 text-green-400 bg-green-950/10"
                              : r.task_type === "mist"
                              ? "border-purple-800/40 text-purple-400 bg-purple-950/10"
                              : "border-gold/30 text-gold bg-gold/10"
                          }`}>
                            {r.task_type === "water" 
                              ? "💧 Water" 
                              : r.task_type === "fertilize" 
                              ? "🌿 Fertilize" 
                              : r.task_type === "mist" 
                              ? "💨 Mist" 
                              : "🪵 Aerate"}
                          </span>

                          {/* Time */}
                          <span className="text-xs font-mono font-bold text-cream tracking-wide">
                            🕒 {r.reminder_time}
                          </span>
                        </div>

                        <div>
                          <p className="font-serif text-cream font-bold text-base leading-tight truncate">{r.plant_name}</p>
                          <p className="text-[10px] text-sand/40 mt-1 uppercase tracking-wider font-mono">Interval: {r.frequency}</p>
                        </div>
                      </div>

                      {/* Actions row */}
                      <div className="flex justify-between items-center border-t border-moss/10 pt-3 mt-4">
                        
                        {/* Toggle enabled status */}
                        <button
                          onClick={() => handleToggleReminder(r.id!, r.is_enabled)}
                          className={`text-[9px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                            r.is_enabled === 1
                              ? "border-moss/30 text-moss hover:bg-moss/5"
                              : "border-sand/10 text-sand/30 hover:bg-sand/5"
                          }`}
                        >
                          {r.is_enabled === 1 ? "Active ✓" : "Paused ⏸"}
                        </button>

                        {/* Delete reminder */}
                        <button
                          onClick={() => handleDeleteReminder(r.id!)}
                          className="text-[9px] uppercase tracking-wider font-bold text-terracotta hover:text-red-400 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-moss/30 rounded-2xl p-12 text-center text-sand/40 bg-moss/5">
                  <p className="text-sm text-cream font-serif mb-1">No Scheduled Alarms</p>
                  <p className="text-xs">Add a plant alarm on the left to activate reminders.</p>
                </div>
              )}

              {/* Advice Tip Box */}
              <div className="border border-gold/10 rounded-2xl p-4 bg-gold/[0.02] flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div className="space-y-1">
                  <p className="font-serif text-xs font-bold text-gold uppercase tracking-wider">Horticulture Advice</p>
                  <p className="text-[11px] text-sand/50 leading-relaxed">
                    Leaving this page open allows our system to poll your local system clock in the background. When alarm times match, a dynamic Major-Harmonic chime will sound automatically to guide your plant ritual!
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
