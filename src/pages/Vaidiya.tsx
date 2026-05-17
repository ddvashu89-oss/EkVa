import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Vaidiya() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Core states
  const [photo, setPhoto] = useState<string | null>(null);
  const [cam, setCam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  // Chat & AI states
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Greetings, seeker. I am Vaidiya AI, guardian of the plant kingdom. Take a photo of your leaf and detect your weather, or ask me any plant wellness question rooted in the oneness of all life.",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<"diagnosis" | "chat">("diagnosis");

  // Checklist state
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Aerate soil surface to 1 inch depth", checked: false },
    { id: 2, text: "Apply 2 tablespoons of Aadhar-Vati near root zone", checked: false },
    { id: 3, text: "Perform Jala-Prana (deep morning watering)", checked: false },
    { id: 4, text: "Prune dead or heavily yellowed leaves", checked: false },
  ]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  useEffect(() => {
    getWeather();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  function useCam() {
    setErr(null);
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          setCam(true);
        }
      })
      .catch(() => setErr("Camera access denied. Use upload instead."));
  }

  function pickFile() {
    fileInputRef.current?.click();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      setPhoto(r.result as string);
      setResult(null);
      setErr(null);
      setActiveTab("diagnosis");
    };
    r.readAsDataURL(f);
    e.target.value = "";
  }

  function capture() {
    const v = videoRef.current,
      c = canvasRef.current;
    if (!v || !c) return;
    c.width = v.videoWidth || 640;
    c.height = v.videoHeight || 480;
    c.getContext("2d")?.drawImage(v, 0, 0);
    setPhoto(c.toDataURL("image/jpeg", 0.9));
    setResult(null);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCam(false);
  }

  function reset() {
    setPhoto(null);
    setResult(null);
    setWeather(null);
    setErr(null);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCam(false);
  }

  function getWeather() {
    setErr(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current=temperature_2m,relative_humidity_2m,weather_code`
        )
          .then((r) => r.json())
          .then((d) => {
            const map: Record<number, string> = {
              0: "Clear Sky",
              1: "Mainly Clear",
              2: "Partly Cloudy",
              3: "Overcast",
              45: "Foggy",
              51: "Drizzle",
              61: "Rain",
              80: "Showers",
            };
            setWeather({
              t: d.current.temperature_2m,
              h: d.current.relative_humidity_2m,
              c: map[d.current.weather_code] || "Mild",
            });
          })
          .catch(() => setErr("Weather service temporarily unavailable."));
      },
      () => {
        // Geolocation denied/blocked: try IP-based location to ALWAYS get actual weather!
        fetch("https://ipapi.co/json/")
          .then((res) => res.json())
          .then((ipData) => {
            if (ipData.latitude && ipData.longitude) {
              fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${ipData.latitude}&longitude=${ipData.longitude}&current=temperature_2m,relative_humidity_2m,weather_code`
              )
                .then((r) => r.json())
                .then((d) => {
                  const map: Record<number, string> = {
                    0: "Clear Sky",
                    1: "Mainly Clear",
                    2: "Partly Cloudy",
                    3: "Overcast",
                    45: "Foggy",
                    51: "Drizzle",
                    61: "Rain",
                    80: "Showers",
                  };
                  setWeather({
                    t: d.current.temperature_2m,
                    h: d.current.relative_humidity_2m,
                    c: map[d.current.weather_code] || "Mild",
                  });
                })
                .catch(() => setErr("Weather service temporarily offline."));
            } else {
              setErr("Location blocked. Using standard metrics.");
            }
          })
          .catch(() => setErr("Location blocked. Using standard metrics."));
      },
      { timeout: 8000 }
    );
  }

  function toggleChecklist(id: number) {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  }

  // Vrikshayurveda & Client-Side AI Response Generator
  function getAIResponse(userInput: string, activeDiagnosis: any) {
    const text = userInput.toLowerCase();
    let responseText = "";

    if (text.includes("neem") || text.includes("pest") || text.includes("insect") || text.includes("bug")) {
      responseText = `🌿 **Vrikshayurveda Neem Shield Recipe**:\n\nTo protect your plant naturally from insects, aphids, or scale, prepare a **Vaidya Shield Blend**:\n1. Mix **1 teaspoon of organic pure Cold-pressed Neem Oil** with 1/2 teaspoon of mild organic liquid soap in **1 liter of lukewarm water**.\n2. Shake thoroughly and spray onto leaves (especially underneath) in the early morning or evening. Avoid afternoon sun to prevent leaf burn.\n\n*Ayurvedic Tip:* Adding a handful of our **Aadhar-Vati Neem** blend into the soil will fortify the plant from the roots up!`;
    } else if (text.includes("aadhar-vati") || text.includes("fertilizer") || text.includes("compost") || text.includes("how to use")) {
      responseText = `✨ **Aadhar-Vati (The Foundation Dose) Application Blueprint**:\n\nTo restore your plant's soil ecosystem and unlock peak vitality:\n1. **Gently loosen** the top 1-2 inches of soil around your plant's drip line (avoiding direct stem damage).\n2. Sprinkle **2-3 tablespoons** (for small pots) or **1/2 cup** (for larger containers) of **Aadhar-Vati**.\n3. Incorporate it lightly into the soil and water deeply to activate the living microbes and vermi-nutrients immediately.\n\n*Why it works:* Rooted in *Samyoga*, our living soil blend introduces premium organic carbon that nourishes the roots gently, preventing chemical fertilizer shock. Repeat every 3-4 weeks.`;
    } else if (text.includes("yellow") || text.includes("pitta")) {
      responseText = `⚠️ **Addressing Yellowing Leaves (Pitta Imbalance)**:\n\nYellowing leaves typically mean one of three things:\n1. **Over-hydration (Kapha accumulation)**: Soil stays waterlogged. Roots cannot breathe. Let the top 2 inches dry out completely.\n2. **Nutrient Depletion**: The plant is hungry. Feed it a nutrient-dense dose of **Aadhar-Vati Pure**.\n3. **Heat Stress**: Hot dry winds are oxidizing the leaves. Mist leaves daily in the morning and move the plant 2 feet away from direct scorching light.`;
    } else if (text.includes("dry") || text.includes("water") || text.includes("droop") || text.includes("vata")) {
      responseText = `💧 **Rehydrating the Soil (Vata Balancing)**:\n\nWhen a plant droops or leaves feel thin/brittle, it experiences high *Vata* (excess dryness):\n1. Check the soil moisture using the finger test. If the soil is bone dry and pulling away from the pot edge, the soil has gone hydrophobic.\n2. Use the **Submersion Method**: Place the pot in a bucket of water for 15 minutes, allowing water to soak upward.\n3. Top dress with **Aadhar-Vati Coco** to increase moisture retention and create a living mulch layer.`;
    } else if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
      responseText = `Greetings, plant guardian! I am ready to guide you. How is your garden breathing today? \n\nYou can ask me about:\n* **Ayurvedic Neem pest sprays**\n* **How to feed with Aadhar-Vati**\n* **Curing yellow or drooping leaves**\n* **Checking your plant's Dosha balance**`;
    } else {
      if (activeDiagnosis) {
        responseText = `🌸 **Vaidiya Botanical Assessment Update**:\n\nBased on your leaf analysis (**${activeDiagnosis.verdict.toUpperCase()}** at ${weather?.t || 28}°C), the plant needs attentive balancing.\n\nTo address this: \n* Optimize **Prana flow** by trimming dry parts.\n* Ensure the container has drainage holes to avoid root rotting.\n* Apply **Aadhar-Vati** once a month for sustained trace mineral absorption.\n\nWhat specific symptoms (spots, leaf drop, insects) are you noticing? Tell me more so I can formulate a targeted herbal remedy.`;
      } else {
        responseText = `🌿 **Ayurvedic Plant Care Guide**:\n\nIn Vrikshayurveda, we see the plant as an extension of ourselves. Every symptom is a language: \n\n* **Yellowing Leaves**: Pitta (heat or excess food) or Kapha (over-moisture).\n* **Brittle & Drooping**: Vata (excess air/dryness).\n* **White Mold/Stagnancy**: Excess Kapha.\n\nTell me about your plant's environment, pot size, and watering habits, and I will draft a personalized recovery recipe!`;
      }
    }

    return responseText;
  }

  // Handle manual input in Chatbot
  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!inputMessage.trim() || aiTyping) return;

    const userMsg = inputMessage;
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInputMessage("");
    setAiTyping(true);

    setTimeout(() => {
      const aiReply = getAIResponse(userMsg, result);
      setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);
      setAiTyping(false);
    }, 1000);
  }

  // Handle Preset Clicks
  function handlePresetClick(presetText: string) {
    if (aiTyping) return;
    setMessages((prev) => [...prev, { role: "user", content: presetText }]);
    setAiTyping(true);

    setTimeout(() => {
      const aiReply = getAIResponse(presetText, result);
      setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);
      setAiTyping(false);
    }, 900);
  }

  // Main Image Pixel Analyzer & Dosha Assessment
  function analyze() {
    if (!photo) {
      setErr("Please provide a photo first.");
      return;
    }
    if (!weather) {
      setWeather({ t: 28, h: 50, c: "Clear Sky" });
    }
    setLoading(true);
    setErr(null);

    setTimeout(() => {
      try {
        const img = new Image();
        img.onload = () => {
          const c = document.createElement("canvas");
          c.width = 200;
          c.height = 200;
          const ctx = c.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(img, 0, 0, 200, 200);
          const px = ctx.getImageData(0, 0, 200, 200).data;

          let red = 0,
            green = 0,
            blue = 0,
            dark = 0,
            yellowish = 0;

          for (let i = 0; i < px.length; i += 4) {
            red += px[i];
            green += px[i + 1];
            blue += px[i + 2];

            const avg = (px[i] + px[i + 1] + px[i + 2]) / 3;
            if (avg < 55) dark++;

            // Detect yellowing (high red & green, low blue)
            if (px[i] > 140 && px[i + 1] > 140 && px[i + 2] < 90) yellowish++;
          }

          const totalPixels = px.length / 4;
          const greenSaturation = Math.round((green / (red + green + blue || 1)) * 100);
          const yellowRatio = yellowish / totalPixels;
          const darkRatio = dark / totalPixels;

          // Hydration score base calculation
          const activeWeather = weather || { t: 28, h: 50 };
          const isHot = activeWeather.t > 30;
          const isDry = activeWeather.h < 40;

          // Compute Ayurvedic Dosha Balance
          let vata = 33,
            pitta = 33,
            kapha = 34; // initial equal distribution

          if (isDry || darkRatio > 0.25) {
            vata = Math.min(75, 40 + Math.round(darkRatio * 100));
            kapha = Math.max(10, 30 - Math.round(darkRatio * 50));
          }
          if (isHot || yellowRatio > 0.08) {
            pitta = Math.min(80, 45 + Math.round(yellowRatio * 150));
            vata = Math.max(10, vata - 10);
          }
          if (activeWeather.h > 75 && yellowRatio === 0) {
            kapha = Math.min(70, 45 + Math.round(activeWeather.h / 3));
            pitta = Math.max(15, pitta - 15);
          }

          // Balance out remaining to equal 100%
          const sum = vata + pitta + kapha;
          vata = Math.round((vata / sum) * 100);
          pitta = Math.round((pitta / sum) * 100);
          kapha = 100 - vata - pitta;

          // Health Indicators
          const leafHealth = Math.max(20, Math.min(98, Math.round(greenSaturation * 2.2) - Math.round(yellowRatio * 200)));
          const hydrationScore = Math.max(15, Math.min(99, 100 - Math.round(vata * 0.9) - (isHot && isDry ? 20 : 0)));
          const diseaseRisk = Math.round((yellowRatio * 0.4 + (kapha > 55 ? 0.3 : 0)) * 100);

          // Build Verdict
          let verdict = "healthy",
            cf = 88,
            ex = "",
            tip = "",
            suggestedChecklist = [];

          if (yellowRatio > 0.05) {
            verdict = "needs-nutrients";
            cf = Math.min(82 + Math.round(yellowRatio * 100), 98);
            ex = `Leaves show yellowing edges, highlighting a Pitta imbalance. At ${activeWeather.t}°C, metabolic oxidative stress is high.`;
            tip = "Feed with Aadhar-Vati Pure compost to restore trace minerals and mist foliage at sunrise.";
            suggestedChecklist = [
              { id: 1, text: "Aerate soil surface to 1 inch depth", checked: false },
              { id: 2, text: "Apply 3 tablespoons of Aadhar-Vati Pure near root zone", checked: false },
              { id: 3, text: "Mist leaves with water in the early morning", checked: false },
              { id: 4, text: "Reposition away from direct direct afternoon sunlight", checked: false },
            ];
          } else if (vata > 45) {
            verdict = "needs-water";
            cf = Math.min(75 + Math.round(vata * 0.5), 99);
            ex = `High Vata (dryness) detected. At ${activeWeather.h}% humidity, the transpiration rate is exceeding moisture uptake.`;
            tip = "Water plant deeply using bottom-up watering and apply Aadhar-Vati Coco to retain moisture.";
            suggestedChecklist = [
              { id: 1, text: "Perform a bottom-up soil soaking for 15 minutes", checked: false },
              { id: 2, text: "Top-dress container with Aadhar-Vati Coco base", checked: false },
              { id: 3, text: "Prune heavily dried leaves and dead twigs", checked: false },
              { id: 4, text: "Check soil daily utilizing the finger depth method", checked: false },
            ];
          } else {
            verdict = "healthy";
            cf = Math.min(85 + Math.round(greenSaturation * 0.3), 99);
            ex = `Vibrant cellular greenness. The plant's three elements (Vata, Pitta, Kapha) are in excellent harmony.`;
            tip = "Keep up the regular care. Add 1 tablespoon of Aadhar-Vati monthly to maintain this state.";
            suggestedChecklist = [
              { id: 1, text: "Add 1 tablespoon of Aadhar-Vati to topsoil", checked: false },
              { id: 2, text: "Dust leaves gently with a damp microfiber cloth", checked: false },
              { id: 3, text: "Rotate pot 90 degrees to ensure even photosynthesis", checked: false },
              { id: 4, text: "Inspect leaf undersides for occasional hitchhikers", checked: false },
            ];
          }

          const newDiagnosis = {
            verdict,
            cf,
            ex,
            tip,
            scores: { leafHealth, hydrationScore, diseaseRisk },
            dosha: { vata, pitta, kapha },
            weather: {
              t: activeWeather.t,
              h: activeWeather.h,
              c: activeWeather.c || "Mild"
            },
            photo: photo // base64 encoded string
          };

          setResult(newDiagnosis);
          setChecklist(suggestedChecklist);

          // Save scan data to database via PHP API
          fetch("/api/diagnoses.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(newDiagnosis)
          })
            .then((res) => {
              if (!res.ok) {
                console.warn("PHP database save failed for cellular scan.");
              }
            })
            .catch((err) => {
              console.warn("PHP server offline, scan saved in client memory only.", err);
            });

          // Update AI chatbot context
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `🔍 **New Diagnosis Recorded!**\nI've analyzed your leaf and local weather (${activeWeather.t}°C, ${activeWeather.h}% RH). \n\n*Verdict:* **${
                verdict === "healthy" ? "Thriving (Balanced)" : verdict === "needs-water" ? "High Vata (Dehydration)" : "High Pitta (Nutrient Deficient)"
              }**.\n\nAsk me how to treat these specific issues or how to implement your care blueprint!`,
            },
          ]);

          setLoading(false);
          setActiveTab("diagnosis");
        };
        img.src = photo;
      } catch {
        setErr("Analysis failed. Please upload a clear image of a single leaf.");
        setLoading(false);
      }
    }, 1500);
  }

  return (
    <section className="min-h-screen pt-28 pb-20 bg-charcoal text-sand">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header section */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.3em] text-gold/60 font-serif">Unified AI Care</span>
          <h1 className="font-serif text-4xl md:text-6xl text-cream mt-3 mb-4">Vaidiya Plant Doctor</h1>
          <p className="text-sand/50 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Ancient *Vrikshayurveda* meets premium computer vision. Analyze your plant's leaf cellular health, map its environmental dosha, and receive custom organic solutions.
          </p>
        </div>

        {/* Responsive Dual Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Input Control (40% width) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Visual Capture Card */}
            <div className="border border-moss/30 rounded-2xl p-4 bg-moss/5 backdrop-blur-sm shadow-xl">
              <span className="text-xs uppercase tracking-[0.2em] text-gold/50 mb-3 block">Leaf Diagnostics Chamber</span>
              
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-moss/30 bg-charcoal/80 flex items-center justify-center">
                {photo ? (
                  <img src={photo} alt="Plant" className="w-full h-full object-cover" />
                ) : cam ? (
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-sand/30 p-6 text-center">
                    <svg className="w-12 h-12 mb-3 text-gold/40 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-xs text-sand/40">Ready to examine foliage. Capture a photo of a single leaf to initialize diagnostic systems.</p>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex gap-3 mt-4">
                {!cam && !photo && (
                  <>
                    <button type="button" onClick={useCam} className="btn-gold flex-1 justify-center py-3">Use Camera</button>
                    <button type="button" onClick={pickFile} className="btn-ghost flex-1 justify-center py-3">Upload Photo</button>
                  </>
                )}
                {cam && (
                  <button type="button" onClick={capture} className="w-full btn-gold justify-center py-3">
                    Capture Photo
                  </button>
                )}
                {photo && (
                  <button type="button" onClick={reset} className="w-full btn-ghost justify-center py-3">
                    Retake &amp; Reset
                  </button>
                )}
              </div>
            </div>

            {/* Location & Atmospheric Detector */}
            <div className="border border-moss/30 rounded-2xl p-5 bg-moss/5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-[0.2em] text-gold/50">Environmental Prana</span>
                {!weather && (
                  <button type="button" onClick={getWeather} className="text-xs text-gold/70 hover:text-gold hover:border-gold border border-gold/30 rounded-full px-3 py-1.5 transition-all">
                    Sync Location
                  </button>
                )}
              </div>
              
              {weather ? (
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="border border-moss/20 rounded-xl p-3 bg-charcoal/30">
                    <p className="text-xl text-gold font-serif font-bold">{weather.t}°C</p>
                    <p className="text-[9px] uppercase tracking-wider text-sand/30 mt-1">Temp</p>
                  </div>
                  <div className="border border-moss/20 rounded-xl p-3 bg-charcoal/30">
                    <p className="text-xl text-gold font-serif font-bold">{weather.h}%</p>
                    <p className="text-[9px] uppercase tracking-wider text-sand/30 mt-1">Humidity</p>
                  </div>
                  <div className="border border-moss/20 rounded-xl p-3 bg-charcoal/30 flex flex-col justify-center items-center">
                    <p className="text-[11px] text-cream font-serif leading-tight">{weather.c}</p>
                    <p className="text-[9px] uppercase tracking-wider text-sand/30 mt-1">Atmos</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-xs text-sand/40 mb-1">Environmental readings missing.</p>
                  <p className="text-[10px] text-sand/30">Sync local atmosphere to integrate environmental factors into the diagnostic model.</p>
                </div>
              )}
            </div>

            {/* Run Analysis Trigger */}
            <button
              type="button"
              onClick={analyze}
              disabled={!photo || loading}
              className={`w-full py-4 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all font-semibold ${
                !photo || loading
                  ? "bg-moss/10 text-sand/20 border border-moss/20 cursor-not-allowed"
                  : "bg-gold/10 border border-gold/40 text-gold hover:bg-gold/20 shadow-lg cursor-pointer"
              }`}
            >
              {loading ? "Aligning Spectrometers..." : "Diagnose Plant Wellness"}
            </button>

            {err && (
              <div className="border border-terracotta/30 rounded-2xl p-4 bg-terracotta/5">
                <p className="text-xs text-terracotta leading-relaxed">{err}</p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Diagnostic Dashboard / Chat Tab Controller (70% width) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tab Swapper Navigation */}
            <div className="flex border-b border-moss/30 p-1 bg-charcoal/40 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("diagnosis")}
                className={`flex-1 py-3 text-xs uppercase tracking-wider rounded-lg transition-all ${
                  activeTab === "diagnosis"
                    ? "bg-moss/20 text-gold border border-gold/20"
                    : "text-sand/50 hover:text-sand"
                }`}
              >
                📊 Leaves Diagnosis
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className={`flex-1 py-3 text-xs uppercase tracking-wider rounded-lg transition-all ${
                  activeTab === "chat"
                    ? "bg-moss/20 text-gold border border-gold/20"
                    : "text-sand/50 hover:text-sand"
                }`}
              >
                💬 Vaidiya AI Chatbot
              </button>
            </div>

            {/* Tab 1: Leaves Diagnosis Dashboard */}
            {activeTab === "diagnosis" && (
              <div className="space-y-6">
                
                {result ? (
                  <>
                    {/* Diagnosis Overview */}
                    <div className="border border-gold/20 rounded-2xl p-6 bg-gradient-to-b from-gold/5 to-moss/5 relative overflow-hidden shadow-xl">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl" />
                      
                      <div className="flex items-center justify-between mb-4 border-b border-moss/20 pb-3">
                        <span className="text-xs tracking-[0.2em] text-gold/60 uppercase font-serif">Vaidya Botanical Verdict</span>
                        <span className="text-xs text-sand/30 font-mono">{result.cf}% Alignment confidence</span>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl p-3 bg-charcoal/40 border border-moss/20 rounded-2xl shadow-inner">
                          {result.verdict === "healthy" ? "🌿" : result.verdict === "needs-water" ? "💧" : "🍂"}
                        </span>
                        <div>
                          <p className="text-xl text-cream font-serif font-bold tracking-wide">
                            {result.verdict === "healthy" ? "Thriving & Balanced" : result.verdict === "needs-water" ? "High Vata (Dehydrated)" : "High Pitta (Nutrient Hungry)"}
                          </p>
                          <p className="text-xs text-gold/60 italic font-serif mt-0.5">[{result.verdict === "healthy" ? "Ekam Harmony" : result.verdict === "needs-water" ? "Vata Vikriti" : "Pitta Vikriti"}]</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-sand/60 leading-relaxed mb-6 bg-charcoal/20 border border-moss/10 rounded-xl p-4">{result.ex}</p>
                      
                      <div className="border border-gold/10 rounded-xl p-4 bg-gold/5">
                        <p className="text-xs uppercase tracking-[0.15em] text-gold font-bold mb-1.5 font-serif">Ayurvedic Healing Protocol</p>
                        <p className="text-sm text-sand/70 leading-relaxed">{result.tip}</p>
                      </div>
                    </div>

                    {/* High-Fidelity Diagnostics Progress bars */}
                    <div className="border border-moss/30 rounded-2xl p-6 bg-moss/5 space-y-5">
                      <span className="text-xs uppercase tracking-[0.2em] text-gold/50 block">Cellular Health Saturation Indices</span>
                      
                      {/* Leaf Greenness */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-sand/50">Greenness Index (Chlorophyll Saturation)</span>
                          <span className="text-gold font-mono">{result.scores.leafHealth}%</span>
                        </div>
                        <div className="h-2 w-full bg-charcoal rounded-full overflow-hidden border border-moss/30">
                          <div className="h-full bg-gradient-to-r from-terracotta to-gold transition-all duration-1000" style={{ width: `${result.scores.leafHealth}%` }} />
                        </div>
                      </div>

                      {/* Soil Hydration Level */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-sand/50">Cellular Hydration Level</span>
                          <span className="text-gold font-mono">{result.scores.hydrationScore}%</span>
                        </div>
                        <div className="h-2 w-full bg-charcoal rounded-full overflow-hidden border border-moss/30">
                          <div className="h-full bg-gradient-to-r from-terracotta via-gold to-gold-light transition-all duration-1000" style={{ width: `${result.scores.hydrationScore}%` }} />
                        </div>
                      </div>

                      {/* Cellular Decay / Disease Risk */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-sand/50">Oxidative Stress &amp; Spotting Index</span>
                          <span className={`font-mono ${result.scores.diseaseRisk > 40 ? "text-terracotta" : "text-gold"}`}>{result.scores.diseaseRisk}%</span>
                        </div>
                        <div className="h-2 w-full bg-charcoal rounded-full overflow-hidden border border-moss/30">
                          <div className="h-full bg-gradient-to-r from-gold to-terracotta transition-all duration-1000" style={{ width: `${result.scores.diseaseRisk}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Vrikshayurveda Dosha Mapping */}
                    <div className="border border-moss/30 rounded-2xl p-6 bg-moss/5">
                      <span className="text-xs uppercase tracking-[0.2em] text-gold/50 block mb-4">Vrikshayurveda Element Balancing</span>
                      
                      <div className="grid grid-cols-3 gap-4">
                        {/* Vata Card */}
                        <div className="border border-moss/20 rounded-xl p-4 bg-charcoal/30 flex flex-col justify-between items-center text-center">
                          <span className="text-xs uppercase tracking-wider text-sand/40">Vata (Air)</span>
                          <p className="text-2xl font-serif font-bold text-gold my-2">{result.dosha.vata}%</p>
                          <span className="text-[10px] text-sand/30 leading-tight">Controls respiration and structural elasticity.</span>
                        </div>

                        {/* Pitta Card */}
                        <div className="border border-moss/20 rounded-xl p-4 bg-charcoal/30 flex flex-col justify-between items-center text-center">
                          <span className="text-xs uppercase tracking-wider text-sand/40">Pitta (Fire)</span>
                          <p className="text-2xl font-serif font-bold text-gold my-2">{result.dosha.pitta}%</p>
                          <span className="text-[10px] text-sand/30 leading-tight">Controls metabolic synthesis and leaf coloring.</span>
                        </div>

                        {/* Kapha Card */}
                        <div className="border border-moss/20 rounded-xl p-4 bg-charcoal/30 flex flex-col justify-between items-center text-center">
                          <span className="text-xs uppercase tracking-wider text-sand/40">Kapha (Water)</span>
                          <p className="text-2xl font-serif font-bold text-gold my-2">{result.dosha.kapha}%</p>
                          <span className="text-[10px] text-sand/30 leading-tight">Controls structural hydration and fluid storage.</span>
                        </div>
                      </div>
                    </div>

                    {/* Care Blueprint Interactive Checklist */}
                    <div className="border border-moss/30 rounded-2xl p-6 bg-moss/5 shadow-inner">
                      <span className="text-xs uppercase tracking-[0.2em] text-gold/50 block mb-4">Interactive Recovery Blueprint</span>
                      
                      <div className="space-y-3">
                        {checklist.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => toggleChecklist(item.id)}
                            className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                              item.checked
                                ? "bg-moss/10 border-moss/40 opacity-50"
                                : "bg-charcoal/30 border-moss/20 hover:border-gold/20"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                              item.checked ? "bg-gold border-gold text-charcoal font-bold" : "border-sand/30"
                            }`}>
                              {item.checked && "✓"}
                            </div>
                            <span className={`text-sm ${item.checked ? "line-through text-sand/40" : "text-sand/80"}`}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ayurvedic Botanical Remedies & Actionable Recipes */}
                    <div className="border border-moss/30 rounded-2xl p-6 bg-moss/5 space-y-6">
                      <div className="flex items-center gap-2.5 border-b border-moss/20 pb-3">
                        <span className="text-xl">🍵</span>
                        <div>
                          <span className="text-xs uppercase tracking-[0.2em] text-gold/60 block">Herbal Remediation Recipes</span>
                          <h3 className="font-serif text-base text-cream mt-0.5">Custom Botanical Remedies</h3>
                        </div>
                      </div>

                      {result.verdict === "needs-nutrients" && (
                        <div className="space-y-4">
                          <div className="border border-moss/20 rounded-xl p-4 bg-charcoal/30 space-y-2">
                            <h4 className="text-xs font-serif text-gold font-bold uppercase tracking-wider">Recipe 1: Mineral-Fortified Soil Feeding</h4>
                            <p className="text-xs text-sand/60 leading-relaxed">
                              Loosen the topsoil to 1 inch depth. Mix <strong>3 tablespoons of Aadhar-Vati Pure</strong> with 1 cup of dry potting soil. Spread the mix evenly around the root zone, avoiding the central stem, and cover with a thin mulch of dry leaves to feed soil microbes.
                            </p>
                          </div>
                          <div className="border border-moss/20 rounded-xl p-4 bg-charcoal/30 space-y-2">
                            <h4 className="text-xs font-serif text-gold font-bold uppercase tracking-wider">Recipe 2: Stomatal Feed Foliar Spray</h4>
                            <p className="text-xs text-sand/60 leading-relaxed">
                              Steep <strong>1 tablespoon of Aadhar-Vati Pure</strong> in 1 liter of warm water overnight. Strain the dark liquid through a cheesecloth. Spray this nutrient-rich liquid onto leaf surfaces (especially undersides) in the early morning to deliver trace elements directly through leaf stomata.
                            </p>
                          </div>
                          
                          {/* Buy Guide recommendation */}
                          <div className="border border-gold/20 rounded-xl p-4 bg-gold/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="space-y-1 text-center md:text-left">
                              <p className="text-xs text-gold uppercase tracking-wider font-bold">Recommended Soil Aid</p>
                              <p className="text-sm text-cream font-serif">Aadhar-Vati Pure (The Foundation Dose)</p>
                              <p className="text-[10px] text-sand/40">Premium vermicompost fortified with mineral carbon to fix leaf yellowing.</p>
                            </div>
                            <Link to="/products" className="btn-gold py-2 text-[10px] uppercase font-semibold">
                              Get Aadhar-Vati
                            </Link>
                          </div>
                        </div>
                      )}

                      {result.verdict === "needs-water" && (
                        <div className="space-y-4">
                          <div className="border border-moss/20 rounded-xl p-4 bg-charcoal/30 space-y-2">
                            <h4 className="text-xs font-serif text-gold font-bold uppercase tracking-wider">Recipe 1: Root Hydration Submersion</h4>
                            <p className="text-xs text-sand/60 leading-relaxed">
                              If soil has gone hydrophobic (dry peat pulling away from edges), place the entire container in a tub filled with 3 inches of water. Allow the pot to soak upward for 15-20 minutes until the topsoil feels damp to the touch, ensuring complete root rehydration.
                            </p>
                          </div>
                          <div className="border border-moss/20 rounded-xl p-4 bg-charcoal/30 space-y-2">
                            <h4 className="text-xs font-serif text-gold font-bold uppercase tracking-wider">Recipe 2: Atmospheric Moisture Shield</h4>
                            <p className="text-xs text-sand/60 leading-relaxed">
                              Mist leaf surfaces daily using a fine spray bottle before 8 AM. Alternatively, place the container on a tray filled with clean pebbles and water. As the water evaporates, it creates a micro-climate of high humidity, reducing moisture stress on drooping leaves.
                            </p>
                          </div>
                          
                          {/* Buy Guide recommendation */}
                          <div className="border border-gold/20 rounded-xl p-4 bg-gold/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="space-y-1 text-center md:text-left">
                              <p className="text-xs text-gold uppercase tracking-wider font-bold">Recommended Soil Aid</p>
                              <p className="text-sm text-cream font-serif">Aadhar-Vati Coco (The Light Base)</p>
                              <p className="text-[10px] text-sand/40">Fortified with high-grade cocopeat to increase moisture retention by 60%.</p>
                            </div>
                            <Link to="/products" className="btn-gold py-2 text-[10px] uppercase font-semibold">
                              Get Aadhar-Vati
                            </Link>
                          </div>
                        </div>
                      )}

                      {result.verdict === "healthy" && (
                        <div className="space-y-4">
                          <div className="border border-moss/20 rounded-xl p-4 bg-charcoal/30 space-y-2">
                            <h4 className="text-xs font-serif text-gold font-bold uppercase tracking-wider">Recipe 1: Monthly Maintenance Ritual</h4>
                            <p className="text-xs text-sand/60 leading-relaxed">
                              Gently sprinkle <strong>1-2 tablespoons of Aadhar-Vati Pure</strong> around the container edges once every 28 days. Lightly rake it into the top soil and water gently to keep soil microorganisms highly active and maintain optimal organic carbon levels.
                            </p>
                          </div>
                          <div className="border border-moss/20 rounded-xl p-4 bg-charcoal/30 space-y-2">
                            <h4 className="text-xs font-serif text-gold font-bold uppercase tracking-wider">Recipe 2: Foliar Cleansing Shine</h4>
                            <p className="text-xs text-sand/60 leading-relaxed">
                              Mix 1-2 drops of pure cold-pressed neem oil in 1 cup of warm water. Dampen a soft microfiber cloth and gently wipe leaf surfaces. This sweeps away dust blocking leaf pores (stomata), boosting sunlight conversion and keeping leaves breathing optimally.
                            </p>
                          </div>
                          
                          {/* Buy Guide recommendation */}
                          <div className="border border-gold/20 rounded-xl p-4 bg-gold/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="space-y-1 text-center md:text-left">
                              <p className="text-xs text-gold uppercase tracking-wider font-bold">Recommended Baseline Care</p>
                              <p className="text-sm text-cream font-serif">Aadhar-Vati series Blends</p>
                              <p className="text-[10px] text-sand/40">Keep soil thriving with premium organic microbial feeds.</p>
                            </div>
                            <Link to="/products" className="btn-gold py-2 text-[10px] uppercase font-semibold">
                              Explore Products
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="border border-moss/20 border-dashed rounded-2xl p-16 text-center text-sand/30 bg-moss/5">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                    </svg>
                    <p className="font-serif text-lg mb-2 text-cream">Waiting for Diagnostics Initializing</p>
                    <p className="text-xs max-w-sm mx-auto leading-relaxed">
                      Upload or capture a leaf photo and click &quot;Diagnose Plant Wellness&quot; in the left panel to populate your dynamic health gauges and care instructions.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Ayurvedic AI Chatbot */}
            {activeTab === "chat" && (
              <div className="border border-moss/30 rounded-2xl bg-charcoal/50 backdrop-blur-md shadow-2xl flex flex-col h-[580px] overflow-hidden">
                
                {/* Chat window Header */}
                <div className="bg-moss/20 px-5 py-4 border-b border-moss/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center bg-charcoal">
                      <span className="text-gold text-[10px] font-serif font-bold animate-pulse">Vd</span>
                    </div>
                    <div>
                      <p className="text-sm text-cream font-serif font-bold leading-none">Vaidiya AI</p>
                      <p className="text-[10px] text-gold/60 mt-1">Ayurvedic Botanical Doctor</p>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-sand/30 font-mono bg-charcoal/40 px-2.5 py-1 rounded-full border border-moss/20">
                    Unified Soil Care
                  </span>
                </div>

                {/* Chat body area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2.5 animate-fadeIn`}>
                      {msg.role !== "user" && (
                        <div className="w-6 h-6 rounded-full border border-gold/30 flex items-center justify-center bg-moss/20 shrink-0 select-none text-[8px] font-bold text-gold">
                          Vd
                        </div>
                      )}
                      
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3.5 text-xs md:text-sm leading-relaxed whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-gold/15 border border-gold/30 text-cream rounded-br-none shadow-md"
                          : "bg-moss/5 border border-moss/20 text-sand/80 rounded-bl-none"
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {aiTyping && (
                    <div className="flex justify-start items-center gap-2">
                      <div className="w-6 h-6 rounded-full border border-gold/30 flex items-center justify-center bg-moss/20 text-[8px] font-bold text-gold shrink-0">
                        Vd
                      </div>
                      <div className="bg-moss/5 border border-moss/20 rounded-2xl rounded-bl-none px-4 py-3 text-xs text-sand/40 italic flex items-center gap-1.5 shadow-inner">
                        <span className="h-1.5 w-1.5 bg-gold/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-1.5 w-1.5 bg-gold/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-1.5 w-1.5 bg-gold/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Starter Question presets */}
                <div className="px-4 py-2 border-t border-moss/10 flex flex-wrap gap-2 bg-charcoal/20 select-none">
                  {[
                    "How to feed with Aadhar-Vati?",
                    "Yellow leaves remedy",
                    "Organic neem pest spray",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className="text-[10px] text-sand/50 hover:text-gold border border-moss/20 hover:border-gold/30 bg-charcoal/40 hover:bg-gold/5 rounded-full px-3 py-1.5 transition-all text-left cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Chat input controller */}
                <form onSubmit={handleSendMessage} className="p-3 bg-charcoal border-t border-moss/30 flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about organic care, pests, soil or Aadhar-Vati..."
                    className="flex-1 bg-moss/5 border border-moss/20 focus:border-gold/40 text-cream placeholder-sand/30 rounded-xl px-4 py-3 text-xs md:text-sm outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || aiTyping}
                    className={`px-5 rounded-xl flex items-center justify-center font-bold text-xs uppercase tracking-wider transition-all border ${
                      !inputMessage.trim() || aiTyping
                        ? "bg-moss/5 border-moss/20 text-sand/20 cursor-not-allowed"
                        : "bg-gold/10 border-gold/40 text-gold hover:bg-gold/20 shadow-md cursor-pointer"
                    }`}
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>

        {/* Informational Guidelines Footer */}
        <div className="mt-16 border-t border-moss/20 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left select-none">
          <div className="border border-moss/15 rounded-xl p-4 bg-charcoal/30">
            <span className="text-[11px] font-serif font-bold text-gold block mb-1">1. Cellular Scan</span>
            <p className="text-[11px] text-sand/40 leading-relaxed">Our advanced algorithm assesses leaf RGB balance to detect chlorophyll levels and identify structural tissue stress indicators.</p>
          </div>
          <div className="border border-moss/15 rounded-xl p-4 bg-charcoal/30">
            <span className="text-[11px] font-serif font-bold text-gold block mb-1">2. Environment Mapping</span>
            <p className="text-[11px] text-sand/40 leading-relaxed">Integrated location sync captures temperature and humidity to map active Vrikshayurveda planetary influences on transpiration.</p>
          </div>
          <div className="border border-moss/15 rounded-xl p-4 bg-charcoal/30">
            <span className="text-[11px] font-serif font-bold text-gold block mb-1">3. Holistic Remedy</span>
            <p className="text-[11px] text-sand/40 leading-relaxed">Vaidiya AI provides instant organic care procedures using Aadhar-Vati micro-doses to restore grounding minerals and balance leaf elements.</p>
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      </div>
    </section>
  );
}
