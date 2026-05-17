import { useEffect, useState } from "react";

interface Order {
  id: string;
  product_name: string;
  variant: string;
  quantity: number;
  name: string;
  phone: string;
  address: string;
  date: string;
  bed: number;
  status: string;
  created_at?: string;
}

interface Diagnosis {
  id: number;
  verdict: string;
  cf: number;
  ex: string;
  tip: string;
  leaf_health: number;
  hydration_score: number;
  disease_risk: number;
  vata: number;
  pitta: number;
  kapha: number;
  temp: number;
  humidity: number;
  atmos: string;
  photo: string;
  created_at?: string;
}

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export default function Admin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "diagnoses" | "messages">("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Administrative Credentials & Session States
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("ekva_admin_auth") === "true";
    }
    return false;
  });
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || "ekva@admin2026";
    if (password === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("ekva_admin_auth", "true");
      sessionStorage.setItem("ekva_admin_password", password);
      setAuthError("");
    } else {
      setAuthError("Incorrect Administrative Key. Access Denied.");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("ekva_admin_auth");
    sessionStorage.removeItem("ekva_admin_password");
    setPassword("");
  };

  const getAuthHeaders = () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    const storedPassword = sessionStorage.getItem("ekva_admin_password") || "";
    if (storedPassword) {
      headers["Authorization"] = `Bearer ${storedPassword}`;
    }
    return headers;
  };

  // Load backend data
  const loadData = async () => {
    if (!sessionStorage.getItem("ekva_admin_password")) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      // 1. Fetch Orders from Node.js API
      const ordersRes = await fetch("/api/orders", {
        headers: getAuthHeaders()
      });
      if (!ordersRes.ok) throw new Error("Orders API returned " + ordersRes.status);
      const ordersJson = await ordersRes.json();
      
      // 2. Fetch Diagnoses from Node.js API
      const diagRes = await fetch("/api/diagnoses", {
        headers: getAuthHeaders()
      });
      if (!diagRes.ok) throw new Error("Diagnoses API returned " + diagRes.status);
      const diagJson = await diagRes.json();

      // 3. Fetch Messages from Node.js API
      const msgRes = await fetch("/api/messages", {
        headers: getAuthHeaders()
      });
      if (!msgRes.ok) throw new Error("Messages API returned " + msgRes.status);
      const msgJson = await msgRes.json();

      if (ordersJson.status === "success" && diagJson.status === "success" && msgJson.status === "success") {
        // Map database naming (snake_case) to state models
        const mappedOrders = ordersJson.data.map((o: any) => ({
          id: o.id,
          product_name: o.product_name,
          variant: o.variant,
          quantity: parseInt(o.quantity),
          name: o.name,
          phone: o.phone,
          address: o.address,
          date: o.date,
          bed: parseInt(o.bed),
          status: o.status,
          created_at: o.created_at
        }));
        
        setOrders(mappedOrders);
        setDiagnoses(diagJson.data);
        setMessages(msgJson.data);
        setDbConnected(true);
      } else {
        throw new Error(ordersJson.message || diagJson.message || msgJson.message || "Unknown error connecting to API");
      }
    } catch (err: any) {
      console.warn("Backend API offline. Switching to offline local storage fallback mode.", err);
      setDbConnected(false);
      
      // Fallback: load orders from localStorage
      const local = localStorage.getItem("ekva_orders");
      if (local) {
        const parsed = JSON.parse(local).map((o: any) => ({
          id: o.id,
          product_name: o.productName,
          variant: o.variant,
          quantity: o.quantity,
          name: o.name,
          phone: o.phone,
          address: o.address,
          date: o.date,
          bed: o.bed,
          status: o.status
        }));
        setOrders(parsed);
      } else {
        setOrders([]);
      }
      
      // Create offline default diagnoses if database is offline
      setDiagnoses([
        {
          id: 999,
          verdict: "needs-nutrients",
          cf: 91,
          ex: "Offline Demo: Leaves show yellowing edges, highlighting a Pitta imbalance. At 31.4°C, metabolic oxidative stress is high.",
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
          photo: "data:image/gif;base64,R0lGODlhAQABAIAAAAD/gAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
        }
      ]);

      setMessages([
        {
          id: 999,
          name: "Offline Guest",
          email: "guest@ekva-demo.in",
          message: "Offline Demo Message: Please launch your local Node.js API server (node server.js) to connect to live Firebase collections!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Trigger Database setup and seed data
  const handleSeedDatabase = async () => {
    setSeeding(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/setup", {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error("Setup endpoint failed");
      const json = await res.json();
      if (json.status === "success") {
        await loadData();
        alert("Database seeded successfully with premium organic records!");
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      alert("Seeding failed: Please ensure the local Node.js backend (node server.js) is active on port 8000!");
      setErrorMsg(err.message);
    } finally {
      setSeeding(false);
    }
  };

  // Delete / Cancel order
  const handleCancelOrder = async (id: string) => {
    if (!confirm(`Are you sure you want to cancel the allocation for order ${id}?`)) return;

    if (dbConnected) {
      try {
        const res = await fetch(`/api/orders?id=${id}`, {
          method: "DELETE",
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Delete request failed");
        
        loadData();
      } catch (err: any) {
        alert("Database error: Could not cancel order. " + err.message);
      }
    } else {
      // Local fallback cancellation
      const local = localStorage.getItem("ekva_orders");
      if (local) {
        const updated = JSON.parse(local).filter((o: any) => o.id !== id);
        localStorage.setItem("ekva_orders", JSON.stringify(updated));
        
        setOrders(updated.map((o: any) => ({
          id: o.id,
          product_name: o.productName,
          variant: o.variant,
          quantity: o.quantity,
          name: o.name,
          phone: o.phone,
          address: o.address,
          date: o.date,
          bed: o.bed,
          status: o.status
        })));
      }
    }
  };

  // Delete message
  const handleDeleteMessage = async (id: string | number) => {
    if (!confirm(`Are you sure you want to permanently delete this message inquiry?`)) return;

    if (dbConnected) {
      try {
        const res = await fetch(`/api/messages?id=${id}`, {
          method: "DELETE",
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Delete request failed");
        loadData();
      } catch (err: any) {
        alert("Database error: Could not delete message. " + err.message);
      }
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }
  };

  // Filter orders, diagnoses or messages based on search query
  const filteredOrders = orders.filter(
    (o) =>
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDiagnoses = diagnoses.filter(
    (d) =>
      d.verdict.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.atmos.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-charcoal text-sand pt-32 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6">
          <div className="border border-moss/30 rounded-2xl p-8 bg-moss/5 backdrop-blur-md relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/[0.02] rounded-full blur-xl pointer-events-none" />
            
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-full border border-gold/60 flex items-center justify-center mx-auto mb-4">
                <span className="text-gold text-sm font-serif">🔒</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-serif">Administrative Gate</span>
              <h2 className="font-serif text-2xl text-cream mt-2">Console Locked</h2>
              <p className="text-sand/50 text-xs mt-2 leading-relaxed">
                Please enter the administrative password to access the Unified Admin Console and trace bio-bed logs.
              </p>
            </div>

            {authError && (
              <div className="border border-terracotta/40 rounded-xl p-3 bg-terracotta/[0.04] mb-5 text-center text-xs text-terracotta select-none animate-fadeIn">
                ⚠️ {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-sand/40 mb-2">
                  Administrative Key
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-charcoal border border-moss/30 rounded-lg px-4 py-3 text-sm text-sand focus:outline-none focus:border-gold/40 placeholder-sand/20 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 px-8 py-3.5 rounded-lg text-sm uppercase tracking-widest transition-all cursor-pointer font-bold"
              >
                Verify & Unlock
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal text-sand pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gold/60 font-serif">Administrative Core</span>
            <h1 className="font-serif text-4xl md:text-5xl text-cream mt-2">Unified Admin Console</h1>
            <p className="text-sand/50 text-xs md:text-sm mt-2 max-w-xl leading-relaxed">
              Monitor compost allocations from our organic bio-beds, view AI plant diagnosis logs, and respond to incoming customer inquiries stored securely in our Firebase Firestore database.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest border border-moss/30 hover:border-gold/30 bg-moss/10 text-sand hover:bg-gold/15 px-5 py-3 rounded-full transition-all cursor-pointer font-bold disabled:opacity-50"
            >
              🔄 Refresh Sync
            </button>
            
            <button
              onClick={handleSeedDatabase}
              disabled={seeding || loading}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest bg-gold/10 border border-gold/40 text-gold hover:bg-gold/25 px-5 py-3 rounded-full transition-all cursor-pointer font-bold disabled:opacity-50"
            >
              {seeding ? "⚙️ Seeding..." : "🌱 Seed DB Samples"}
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest border border-terracotta/30 hover:border-terracotta/60 bg-terracotta/5 text-terracotta hover:bg-terracotta/10 px-5 py-3 rounded-full transition-all cursor-pointer font-bold"
            >
              🔒 Lock Console
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          
          {/* Stat 1: Total Orders */}
          <div className="border border-moss/30 rounded-2xl p-5 bg-moss/5 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gold/[0.02] rounded-full blur-xl pointer-events-none" />
            <p className="text-[10px] uppercase tracking-wider text-sand/40 font-mono">Compost Orders</p>
            <p className="text-2xl font-serif font-bold text-gold mt-2">{orders.length} Batches</p>
            <p className="text-[10px] text-sand/30 mt-1">Total: {orders.reduce((sum, o) => sum + o.quantity, 0)} bags</p>
          </div>

          {/* Stat 2: Active Beds Sourced */}
          <div className="border border-moss/30 rounded-2xl p-5 bg-moss/5 backdrop-blur-sm relative overflow-hidden">
            <p className="text-[10px] uppercase tracking-wider text-sand/40 font-mono">Allocated Beds</p>
            <p className="text-2xl font-serif font-bold text-gold mt-2">
              {Array.from(new Set(orders.map((o) => o.bed))).length} Active
            </p>
            <p className="text-[10px] text-sand/30 mt-1">Sourced from 3.5 acres</p>
          </div>

          {/* Stat 3: Total Cellular Scans */}
          <div className="border border-moss/30 rounded-2xl p-5 bg-moss/5 backdrop-blur-sm relative overflow-hidden">
            <p className="text-[10px] uppercase tracking-wider text-sand/40 font-mono">Cellular Scans</p>
            <p className="text-2xl font-serif font-bold text-gold mt-2">{diagnoses.length} Records</p>
            <p className="text-[10px] text-sand/30 mt-1">Leaf hydration & chlorophyll logs</p>
          </div>

          {/* Stat 4: Contact Messages */}
          <div className="border border-moss/30 rounded-2xl p-5 bg-moss/5 backdrop-blur-sm relative overflow-hidden">
            <p className="text-[10px] uppercase tracking-wider text-sand/40 font-mono">Inquiries Inbox</p>
            <p className="text-2xl font-serif font-bold text-gold mt-2">{messages.length} Messages</p>
            <p className="text-[10px] text-sand/30 mt-1">Direct website contact submissions</p>
          </div>

          {/* Stat 5: Database Sync Status */}
          <div className={`border rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden ${
            dbConnected 
              ? "border-green-800/40 bg-green-950/[0.05]" 
              : "border-terracotta/40 bg-terracotta/[0.03]"
          }`}>
            <p className="text-[10px] uppercase tracking-wider text-sand/40 font-mono">MySQL Database</p>
            
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                dbConnected ? "bg-green-500 animate-pulse" : "bg-terracotta animate-pulse"
              }`} />
              <p className="text-lg font-serif font-bold text-cream">
                {dbConnected ? "Connected" : "Offline Fallback"}
              </p>
            </div>
            
            <p className="text-[9px] text-sand/30 mt-1 leading-tight">
              {dbConnected 
                ? "Live sync active with MySQL Database 'ekva_db'" 
                : "Using browser local storage fallback"}
            </p>
          </div>
        </div>

        {/* CONDITIONAL OFFLINE / SETUP HELP BANNER */}
        {dbConnected === false && (
          <div className="border border-gold/20 rounded-2xl p-6 bg-gold/[0.03] mb-8 space-y-4">
            <div className="flex items-center gap-2 text-gold">
              <span className="text-xl">💡</span>
              <p className="font-serif text-base font-bold uppercase tracking-wider">How to connect live MySQL Database:</p>
            </div>
            
            <p className="text-xs text-sand/60 leading-relaxed">
              The Next.js frontend is currently operating in <strong>Offline Fallback Mode</strong> because the local PHP API is unreachable. To link your live MySQL database, follow these three simple steps:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="border border-moss/20 rounded-xl p-4 bg-charcoal/40">
                <span className="text-gold font-bold block mb-1">1. Active Apache &amp; MySQL</span>
                <p className="text-[11px] text-sand/40">Open your <strong>XAMPP Control Panel</strong> and click &quot;Start&quot; next to <strong>Apache</strong> and <strong>MySQL</strong>.</p>
              </div>
              <div className="border border-moss/20 rounded-xl p-4 bg-charcoal/40">
                <span className="text-gold font-bold block mb-1">2. Run Local PHP API</span>
                <p className="text-[11px] text-sand/40">Open terminal inside <code>/php-backend</code> directory and run: <br/><code className="text-gold font-mono block bg-black/30 p-1.5 rounded mt-1">C:\xampp\php\php.exe -S localhost:8000 -t php-backend</code></p>
              </div>
              <div className="border border-moss/20 rounded-xl p-4 bg-charcoal/40">
                <span className="text-gold font-bold block mb-1">3. Refresh and Seed</span>
                <p className="text-[11px] text-sand/40">Click the <strong>&quot;Refresh Sync&quot;</strong> button above. The tables will auto-create. Click <strong>&quot;Seed DB Samples&quot;</strong> to fill sample data!</p>
              </div>
            </div>
          </div>
        )}

        {/* CONTROLS BAR: SEARCH & TABS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-moss/30 pb-4 mb-6 bg-charcoal/40 p-4 rounded-xl border border-moss/20">
          
          {/* Tabs switch */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setActiveTab("orders"); setSearchQuery(""); }}
              className={`px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all font-semibold ${
                activeTab === "orders"
                  ? "bg-moss/20 text-gold border border-gold/25"
                  : "text-sand/50 hover:text-sand hover:bg-moss/5"
              }`}
            >
              🛍️ Sourced Orders ({filteredOrders.length})
            </button>
            <button
              onClick={() => { setActiveTab("diagnoses"); setSearchQuery(""); }}
              className={`px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all font-semibold ${
                activeTab === "diagnoses"
                  ? "bg-moss/20 text-gold border border-gold/25"
                  : "text-sand/50 hover:text-sand hover:bg-moss/5"
              }`}
            >
              🔬 Leaf Scans Log ({filteredDiagnoses.length})
            </button>
            <button
              onClick={() => { setActiveTab("messages"); setSearchQuery(""); }}
              className={`px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all font-semibold ${
                activeTab === "messages"
                  ? "bg-moss/20 text-gold border border-gold/25"
                  : "text-sand/50 hover:text-sand hover:bg-moss/5"
              }`}
            >
              ✉️ Inquiries Inbox ({filteredMessages.length})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder={
                activeTab === "orders" 
                  ? "Search customer, ID, or product..." 
                  : activeTab === "diagnoses"
                  ? "Search verdict or atmospheric state..."
                  : "Search sender name, email, or message..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-charcoal/60 border border-moss/30 focus:border-gold/40 text-cream placeholder-sand/30 rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-sand/30 hover:text-gold text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* LOAD OR EMPTY STATE */}
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-gold/60">Fetching sync status...</p>
          </div>
        ) : activeTab === "orders" ? (
          
          /* TAB 1: ORDERS DASHBOARD */
          filteredOrders.length > 0 ? (
            <div className="border border-moss/30 rounded-2xl overflow-hidden bg-moss/5 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm border-collapse select-none">
                  <thead>
                    <tr className="bg-moss/10 border-b border-moss/20 text-gold font-serif uppercase tracking-wider text-[10px]">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer Info</th>
                      <th className="p-4">Sourced Product</th>
                      <th className="p-4 text-center">Qty / Sourced Bed</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Address</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-moss/10">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-moss/[0.08] transition-colors">
                        
                        {/* ID */}
                        <td className="p-4 align-top">
                          <span className="font-mono text-[10px] tracking-wider text-gold bg-gold/10 px-2.5 py-1 rounded-full uppercase">
                            {o.id}
                          </span>
                        </td>
                        
                        {/* Customer */}
                        <td className="p-4 align-top">
                          <p className="font-medium text-cream">{o.name}</p>
                          <p className="text-xs text-sand/40 mt-0.5 font-mono">{o.phone}</p>
                        </td>

                        {/* Product */}
                        <td className="p-4 align-top">
                          <p className="text-cream">{o.product_name}</p>
                          <p className="text-[10px] text-sand/30 font-serif italic">{o.variant.split(" (")[0]}</p>
                        </td>

                        {/* Qty & Bed */}
                        <td className="p-4 align-top text-center">
                          <p className="text-cream font-mono font-bold">{o.quantity} Bags</p>
                          <span className="inline-block text-[10px] text-gold font-bold mt-1 bg-charcoal/40 border border-moss/20 px-2 py-0.5 rounded-full">
                            Bed #{o.bed}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="p-4 align-top text-sand/40 font-mono">
                          {o.date}
                        </td>

                        {/* Address */}
                        <td className="p-4 align-top text-sand/50 max-w-[200px] truncate" title={o.address}>
                          {o.address}
                        </td>

                        {/* Status */}
                        <td className="p-4 align-top">
                          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold text-moss mt-1 bg-moss/10 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-moss rounded-full animate-ping shrink-0" />
                            {o.status}
                          </span>
                        </td>

                        {/* Action buttons */}
                        <td className="p-4 align-top text-center">
                          <button
                            onClick={() => handleCancelOrder(o.id)}
                            className="text-[10px] font-bold uppercase tracking-wider text-terracotta border border-terracotta/20 hover:border-terracotta hover:bg-terracotta/5 px-3 py-1.5 rounded-full transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-moss/30 rounded-2xl p-16 text-center text-sand/40 bg-moss/5">
              <p className="text-base text-cream font-serif mb-1">No Orders Found</p>
              <p className="text-xs">No orders match the current filters or query criteria.</p>
            </div>
          )
        ) : activeTab === "diagnoses" ? (
          
          /* TAB 2: DIAGNOSES LOG */
          filteredDiagnoses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDiagnoses.map((d) => (
                <div 
                  key={d.id}
                  className="border border-moss/30 hover:border-gold/20 rounded-2xl p-5 bg-moss/5 backdrop-blur-sm relative overflow-hidden transition-all flex flex-col justify-between shadow-xl"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold/[0.01] rounded-full blur-xl pointer-events-none" />

                  {/* Header diagnosis block */}
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center border-b border-moss/20 pb-3">
                      
                      {/* Scan Tag */}
                      <span className={`inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-mono border rounded-full px-2.5 py-1 ${
                        d.verdict === "healthy"
                          ? "border-green-800/40 text-green-500 bg-green-950/10"
                          : d.verdict === "needs-water"
                          ? "border-blue-800/40 text-blue-400 bg-blue-950/10"
                          : "border-terracotta/40 text-terracotta bg-terracotta/10"
                      }`}>
                        {d.verdict === "healthy" ? "🌿 Healthy" : d.verdict === "needs-water" ? "💧 Vata (Dry)" : "🍂 Pitta (Hungry)"}
                      </span>
                      
                      <span className="text-[10px] text-sand/30 font-mono">
                        Conf: {d.cf}%
                      </span>
                    </div>

                    {/* Image Thumbnail and Details Row */}
                    <div className="flex gap-4 items-start">
                      
                      {/* Leaf image thumbnail */}
                      {d.photo && (
                        <div 
                          className="w-16 h-16 rounded-xl border border-moss/30 overflow-hidden shrink-0 relative bg-charcoal/80 cursor-pointer group"
                          onClick={() => setExpandedPhoto(d.photo)}
                          title="Click to view full image"
                        >
                          <img 
                            src={d.photo} 
                            alt="Leaf" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <span className="text-white text-[8px] uppercase tracking-wider font-bold">Zoom</span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <p className="text-xs font-serif text-cream italic leading-tight">
                          {d.verdict === "healthy" ? "Ekam Harmony State" : d.verdict === "needs-water" ? "Vata Vikriti Imbalance" : "Pitta Vikriti Imbalance"}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-sand/40">
                          <span>🌤️ {d.temp}°C, {d.humidity}%</span>
                          <span className="text-sand/30">|</span>
                          <span className="truncate max-w-[80px]" title={d.atmos}>{d.atmos}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-sand/50 leading-relaxed bg-charcoal/20 border border-moss/10 rounded-xl p-3">
                      {d.ex}
                    </p>

                    {/* Progress Health Gauges */}
                    <div className="space-y-2 border-t border-moss/20 pt-3">
                      
                      {/* Chlorophyll gauge */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-sand/40">Chlorophyll Level</span>
                          <span className="text-gold font-bold font-mono">{d.leaf_health}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-charcoal rounded-full overflow-hidden border border-moss/20">
                          <div className="h-full bg-gradient-to-r from-terracotta to-gold transition-all" style={{ width: `${d.leaf_health}%` }} />
                        </div>
                      </div>

                      {/* Hydration gauge */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-sand/40">Cellular Hydration</span>
                          <span className="text-gold font-bold font-mono">{d.hydration_score}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-charcoal rounded-full overflow-hidden border border-moss/20">
                          <div className="h-full bg-gradient-to-r from-terracotta via-gold to-gold-light transition-all" style={{ width: `${d.hydration_score}%` }} />
                        </div>
                      </div>

                      {/* Decay gauge */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-sand/40">Disease / Spots Risk</span>
                          <span className="text-terracotta font-bold font-mono">{d.disease_risk}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-charcoal rounded-full overflow-hidden border border-moss/20">
                          <div className="h-full bg-gradient-to-r from-gold to-terracotta transition-all" style={{ width: `${d.disease_risk}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Dosha Element ratios */}
                    <div className="border border-moss/20 rounded-xl p-2.5 bg-charcoal/20 space-y-1.5">
                      <p className="text-[9px] uppercase tracking-widest text-sand/30 font-semibold">Ayurvedic Element doshas</p>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-sand/50">Vata: <strong>{d.vata}%</strong></span>
                        <span className="text-sand/50">Pitta: <strong>{d.pitta}%</strong></span>
                        <span className="text-sand/50">Kapha: <strong>{d.kapha}%</strong></span>
                      </div>
                      <div className="h-1.5 w-full rounded-full overflow-hidden flex gap-0.5 border border-moss/10">
                        <div className="h-full bg-gold" style={{ width: `${d.vata}%` }} />
                        <div className="h-full bg-terracotta" style={{ width: `${d.pitta}%` }} />
                        <div className="h-full bg-moss" style={{ width: `${d.kapha}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Botanical Remedy Recipe */}
                  <div className="mt-4 border border-gold/10 rounded-xl p-3 bg-gold/[0.03] space-y-1 select-none">
                    <p className="text-[9px] uppercase tracking-wider text-gold font-bold font-serif">Prescribed organic recipe</p>
                    <p className="text-[10px] text-sand/70 leading-normal leading-relaxed">{d.tip}</p>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-moss/30 rounded-2xl p-16 text-center text-sand/40 bg-moss/5">
              <p className="text-base text-cream font-serif mb-1">No Scans Recorded</p>
              <p className="text-xs">No plant scans matching the query are logged in the system.</p>
            </div>
          )
        ) : (
          
          /* TAB 3: CONTACT MESSAGES INBOX */
          filteredMessages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMessages.map((m) => (
                <div 
                  key={m.id}
                  className="border border-moss/30 hover:border-gold/20 rounded-2xl p-5 bg-moss/5 backdrop-blur-sm relative overflow-hidden transition-all flex flex-col justify-between shadow-xl"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold/[0.01] rounded-full blur-xl pointer-events-none" />

                  <div className="space-y-4">
                    {/* Header Info */}
                    <div className="flex justify-between items-start border-b border-moss/20 pb-3">
                      <div>
                        <p className="font-serif text-cream font-bold text-sm leading-tight">{m.name}</p>
                        <a 
                          href={`mailto:${m.email}`}
                          className="text-[10px] text-gold hover:underline mt-1 block font-mono"
                        >
                          ✉️ {m.email}
                        </a>
                      </div>
                      
                      <span className="text-[10px] text-sand/30 font-mono">
                        {m.created_at ? new Date(m.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        }) : "Live Received"}
                      </span>
                    </div>

                    {/* Message Body */}
                    <p className="text-[11px] text-sand/60 leading-relaxed bg-charcoal/20 border border-moss/10 rounded-xl p-3 select-text min-h-[90px]">
                      &ldquo;{m.message}&rdquo;
                    </p>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-4 border-t border-moss/10 pt-3 flex justify-between items-center">
                    <a 
                      href={`mailto:${m.email}?subject=Regarding your Ekva inquiry`}
                      className="text-[10px] font-bold uppercase tracking-wider text-gold border border-gold/20 hover:border-gold hover:bg-gold/5 px-4 py-1.5 rounded-full transition-all shrink-0 cursor-pointer text-center"
                    >
                      Reply via Mail
                    </a>
                    
                    <button
                      onClick={() => handleDeleteMessage(m.id)}
                      className="text-[10px] font-bold uppercase tracking-wider text-terracotta border border-terracotta/20 hover:border-terracotta hover:bg-terracotta/5 px-4 py-1.5 rounded-full transition-all shrink-0 cursor-pointer"
                    >
                      Delete Inquiry
                    </button>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-moss/30 rounded-2xl p-16 text-center text-sand/40 bg-moss/5">
              <p className="text-base text-cream font-serif mb-1">No Messages Found</p>
              <p className="text-xs">No customer inquiries match the current filters or query criteria.</p>
            </div>
          )
        )}

      </div>

      {/* FULL LEAF IMAGE EXPANSE DRAWER / MODAL */}
      {expandedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 backdrop-blur-md p-4">
          <div className="relative max-w-lg w-full border border-moss/30 bg-charcoal rounded-2xl overflow-hidden shadow-2xl p-4 flex flex-col items-center">
            
            <button
              onClick={() => setExpandedPhoto(null)}
              className="absolute top-4 right-4 bg-charcoal/80 border border-moss/30 text-sand/70 hover:text-gold w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer hover:border-gold/30 transition-all z-10"
            >
              ✕
            </button>
            
            <div className="w-full aspect-[4/3] relative rounded-xl overflow-hidden border border-moss/20 mt-8 mb-4">
              <img 
                src={expandedPhoto} 
                alt="Leaf High Resolution Scan" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <p className="text-xs text-sand/40 font-mono tracking-widest uppercase">Plant Cellular Specimen Scan</p>
          </div>
        </div>
      )}

    </div>
  );
}
