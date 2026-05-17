"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    name: "Aadhar-Vati",
    sanskrit: "The Foundation Dose",
    tag: "Pure",
    image: "/images/seedling-soil.jpg",
    description:
      "Our flagship vermicompost. Fully decomposed, triple-sieved, and alive with beneficial microbes. The essential foundation for every plant parent.",
    variants: ["1kg Refill Pouch (₹199)", "5kg Bulk Bag (₹799)"],
    price: "From ₹199",
  },
  {
    name: "Aadhar-Vati Neem",
    sanskrit: "The Shield",
    tag: "Vermi-Neem",
    image: "/images/hands-plant.jpg",
    description:
      "Fortified with cold-pressed neem cake for natural pest resistance. Perfect for indoor plants and urban balconies where chemical sprays aren't an option.",
    variants: ["1kg Refill Pouch (₹249)", "5kg Bulk Bag (₹999)"],
    price: "From ₹249",
  },
  {
    name: "Aadhar-Vati Coco",
    sanskrit: "The Light Base",
    tag: "Vermi-Coco",
    image: "/images/seedling-tray.jpg",
    description:
      "Blended with high-quality cocopeat for lightweight pots and hanging baskets. Ideal for terrace gardens and balcony planters.",
    variants: ["1kg Refill Pouch (₹229)", "5kg Bulk Bag (₹899)"],
    price: "From ₹229",
  },
  {
    name: "Amrit-Ek",
    sanskrit: "The Weekly Nectar",
    tag: "Bio-Nectar",
    image: "/images/monstera-leaf.jpg",
    description:
      "Liquid bio-enzyme plant feed and cellular energizer. Fermented over 90 days with active micro-nutrients to build instant root uptake and vibrant green growth.",
    variants: ["250ml Concentrate (₹299)", "1L Garden Pack (₹899)"],
    price: "From ₹299",
  },
  {
    name: "Shuddhi-Ek",
    sanskrit: "The Leaf Elixir",
    tag: "Leaf Elixir",
    image: "/images/portrait-plant.jpg",
    description:
      "Organic foliar mist for cellular cleansing and pest prevention. Enriched with active botanicals to clean stomata, maximize photosynthesis, and repel insects.",
    variants: ["500ml Spray Bottle (₹349)", "1L Refill Pack (₹599)"],
    price: "From ₹349",
  },
  {
    name: "Jeevan-Ek",
    sanskrit: "The Rescue Drops",
    tag: "Rescue Drops",
    image: "/images/composting.jpg",
    description:
      "Root hormone, stress relief, and shock recovery concentrate. Rooted in traditional botanical growth promoters to revive droopy, repotted, or dying houseplants.",
    variants: ["50ml Dropper Bottle (₹399)", "100ml Value Pack (₹699)"],
    price: "From ₹399",
  },
];

const upcoming = [
  {
    name: "Prana-Ek",
    sanskrit: "The Oxygen Base",
    description: "Premium expanded lightweight volcanic aeration media — coming soon.",
  },
  {
    name: "Kalyan-Vati",
    sanskrit: "The Seasonal Feed",
    description: "Soil-healing winter compost fortified with bio-char and active trace minerals — coming soon.",
  },
  {
    name: "Tejas-Ek",
    sanskrit: "The Bloom Catalyst",
    description: "Flowering boost enzyme rich in organic potassium and high-phosphorus organic flower meals — coming soon.",
  },
];

export default function ProductsPage() {
  const [activeProduct, setActiveProduct] = useState<any>(null);
  const [variant, setVariant] = useState("");
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [successOrder, setSuccessOrder] = useState<any>(null);

  function openOrderModal(prod: any) {
    setActiveProduct(prod);
    setVariant(prod.variants[0]);
    setQty(1);
    setName("");
    setPhone("");
    setAddress("");
    setSuccessOrder(null);
  }

  function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;

    const orderId = `EKV-${Math.floor(100000 + Math.random() * 900000)}`;
    const bedNo = Math.floor(1 + Math.random() * 60);
    const dateStr = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const newOrder = {
      id: orderId,
      productName: activeProduct.name,
      variant,
      quantity: qty,
      name,
      phone,
      address,
      date: dateStr,
      bed: bedNo,
      status: "🌿 Bio-Bed Sourced",
    };

    // Save to localStorage as fallback
    const existing = localStorage.getItem("ekva_orders");
    const list = existing ? JSON.parse(existing) : [];
    list.unshift(newOrder);
    localStorage.setItem("ekva_orders", JSON.stringify(list));

    // Save to database via Node.js API
    fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOrder),
    })
      .then((res) => {
        if (!res.ok) {
          console.warn("Node.js database order failed, saved to local storage fallback only.");
        }
      })
      .catch((err) => {
        console.warn("Node.js server offline, saved to local storage fallback only.", err);
      });

    setSuccessOrder(newOrder);
  }

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <Image
          src="/images/indoor-plants.jpg"
          alt=""
          fill
          className="object-cover opacity-15"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-moss/30 to-charcoal" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-4">
            <span className="text-xs uppercase tracking-[0.3em] text-gold/50">
              The Wellness Range
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-cream mb-6 leading-tight">
            Plant Wellness, <br />
            <span className="text-gold">Rooted in Oneness</span>
          </h1>
          <p className="text-base md:text-lg text-sand/50 max-w-2xl mx-auto leading-relaxed">
            Every product is born from our 3.5 acres of living soil. Fortified,
            traceable, and crafted for the urban plant parent.
          </p>
        </div>
      </section>

      {/* ── CORE PRODUCTS ── */}
      <section className="py-20 border-t border-moss/20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-gold/50">
              Available Now
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-cream mt-4 leading-tight">
              The Aadhar-Vati Series
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.name}
                className="border border-moss/30 rounded-2xl p-8 hover:border-gold/20 transition-all bg-moss/5 flex flex-col"
              >
                <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden mb-6 border border-moss/20">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-gold/50 border border-gold/20 rounded-full px-3 py-1 mb-6 self-start">
                  {product.tag}
                </span>

                <p className="text-xl text-cream font-serif mb-1">
                  {product.name}
                </p>
                <p className="text-xs text-cream/30 mb-4 font-serif italic">
                  [{product.sanskrit}]
                </p>

                <p className="text-sm text-sand/40 leading-relaxed mb-6 flex-1">
                  {product.description}
                </p>

                <div className="border-t border-moss/20 pt-4 mb-6">
                  <p className="text-[10px] uppercase tracking-wider text-sand/30 mb-2">
                    Available in
                  </p>
                  {product.variants.map((v) => (
                    <p key={v} className="text-xs text-sand/50">
                      &bull; {v.split(" (")[0]}
                    </p>
                  ))}
                </div>

                <p className="text-gold text-sm mb-4">{product.price}</p>

                <button
                  type="button"
                  onClick={() => openOrderModal(product)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 px-6 py-2.5 rounded-full text-xs uppercase tracking-widest transition-all cursor-pointer"
                >
                  Pre-Order Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING PRODUCTS ── */}
      <section className="py-20 border-t border-moss/20 bg-moss/5">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-gold/50">
              Coming Soon
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-cream mt-4 leading-tight">
              The Wellness Rituals
            </h2>
            <p className="text-sand/50 mt-4 max-w-lg mx-auto">
              Expanding the ecosystem. Liquids, mists, and rescue drops for the
              complete plant care ritual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcoming.map((product) => (
              <div
                key={product.name}
                className="border border-dashed border-moss/30 rounded-2xl p-8 opacity-60"
              >
                <p className="text-lg text-cream font-serif mb-1">
                  {product.name}
                </p>
                <p className="text-xs text-cream/30 mb-4 font-serif italic">
                  [{product.sanskrit}]
                </p>
                <p className="text-sm text-sand/40 leading-relaxed">
                  {product.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRE-ORDER MODAL DRAWER ── */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-charcoal/70 backdrop-blur-sm transition-opacity">
          {/* Backdrop Click */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setActiveProduct(null)}
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-md h-full bg-charcoal border-l border-moss/30 p-8 shadow-2xl overflow-y-auto flex flex-col justify-between z-10">
            <div>
              {/* Close Header */}
              <div className="flex items-center justify-between mb-8 border-b border-moss/20 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-gold/50">Secure Pre-Order</span>
                  <h3 className="font-serif text-xl text-cream mt-1">Order {activeProduct.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveProduct(null)}
                  className="text-sand/50 hover:text-gold text-xl cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {!successOrder ? (
                <form onSubmit={handlePlaceOrder} className="space-y-5">
                  {/* Select Variant */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-sand/40 mb-2">
                      Select Variant
                    </label>
                    <select
                      value={variant}
                      onChange={(e) => setVariant(e.target.value)}
                      className="w-full bg-charcoal border border-moss/30 rounded-lg px-4 py-3 text-sm text-sand focus:outline-none focus:border-gold/40"
                    >
                      {activeProduct.variants.map((v: string) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity Selector */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-sand/40 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="w-10 h-10 border border-moss/30 rounded-lg text-sand hover:border-gold flex items-center justify-center font-bold text-lg cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-cream text-lg font-mono w-6 text-center">{qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(qty + 1)}
                        className="w-10 h-10 border border-moss/30 rounded-lg text-sand hover:border-gold flex items-center justify-center font-bold text-lg cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <hr className="border-moss/20 my-6" />

                  {/* Recipient details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-sand/40 mb-2">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Darshil Mehta"
                        className="w-full bg-charcoal border border-moss/30 rounded-lg px-4 py-3 text-sm text-sand focus:outline-none focus:border-gold/40 placeholder-sand/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-sand/40 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full bg-charcoal border border-moss/30 rounded-lg px-4 py-3 text-sm text-sand focus:outline-none focus:border-gold/40 placeholder-sand/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-sand/40 mb-2">
                        Delivery Address
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter full shipping address..."
                        className="w-full bg-charcoal border border-moss/30 rounded-lg px-4 py-3 text-sm text-sand focus:outline-none focus:border-gold/40 resize-none placeholder-sand/20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gold text-charcoal font-semibold hover:bg-gold-light py-4 rounded-xl text-xs uppercase tracking-[0.2em] transition-all shadow-lg cursor-pointer mt-6"
                  >
                    Confirm Pre-Order
                  </button>
                </form>
              ) : (
                /* Success confirmation card */
                <div className="space-y-6 text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/40 text-gold flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
                    ✓
                  </div>
                  <h4 className="font-serif text-2xl text-cream">Pre-Order Successful!</h4>
                  <p className="text-xs text-sand/40 leading-relaxed px-4">
                    Your batch of living soil has been successfully allocated. Your vermicompost is being sourced straight from the bio-beds!
                  </p>

                  <div className="border border-gold/20 rounded-xl p-4 bg-gold/5 text-left space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-sand/40">Order ID:</span>
                      <span className="text-gold font-mono font-bold">{successOrder.id}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-sand/40">Product:</span>
                      <span className="text-cream">{successOrder.productName}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-sand/40">Quantity:</span>
                      <span className="text-cream font-mono">{successOrder.quantity}x</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-sand/40">Trace Bed:</span>
                      <span className="text-gold font-bold">Bio-Bed #{successOrder.bed}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6">
                    <Link
                      href="/orders"
                      className="w-full inline-flex items-center justify-center btn-gold py-3 text-xs uppercase tracking-widest"
                    >
                      View Orders Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => setActiveProduct(null)}
                      className="w-full text-xs text-sand/40 hover:text-gold tracking-widest uppercase border border-moss/30 py-3 rounded-xl hover:bg-moss/5 cursor-pointer"
                    >
                      Continue Browsing
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center text-[10px] text-sand/30 border-t border-moss/20 pt-4 mt-8">
              🔒 Encrypted trace bed allocation. Ekva direct organic delivery.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
