"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ShoppingBag, MessageCircle, Send, X, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Merchandise {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  whatsappNumber?: string;
}

export default function MerchandisePage() {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Merchandise | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Order Form State
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerPhone: "",
    quantity: 1,
    size: "L",
    notes: "",
  });

  const defaultMerch: Merchandise[] = [
    {
      id: "1",
      name: "Official ALSA LC Unsrat PDH / Varsity Jacket",
      description:
        "Exclusive premium cotton fleece jacket with high-density embroidered ALSA insignia and custom initials.",
      price: 250000,
      whatsappNumber: "6281234567890",
    },
    {
      id: "2",
      name: "ALSA Law Edition Lanyard & ID Card Holder",
      description:
        "Durable woven satin lanyard featuring ALSA four pillars tagline with genuine leather card holder.",
      price: 45000,
      whatsappNumber: "6281234567890",
    },
    {
      id: "3",
      name: "ALSA Canvas Tote Bag & Enamel Pin Set",
      description:
        "Eco-friendly heavy-duty canvas tote bag with inner pocket, paired with official gold-plated ALSA scale pin.",
      price: 75000,
      whatsappNumber: "6281234567890",
    },
  ];

  useEffect(() => {
    const fetchMerchandise = async () => {
      try {
        const response = await fetch("/api/merchandise");
        if (response.ok) {
          const data = await response.json();
          setMerchandise(data);
        }
      } catch (error) {
        console.error("Failed to fetch merchandise:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchandise();
  }, []);

  const displayMerch = merchandise.length > 0 ? merchandise : defaultMerch;

  const handleOpenOrder = (item: Merchandise) => {
    setSelectedItem(item);
    setIsOrderModalOpen(true);
  };

  const handleSendOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const phone = selectedItem.whatsappNumber || "6281234567890";
    const text = `Halo Admin ALSA LC Unsrat, saya ingin memesan Merchandise:
*Produk:* ${selectedItem.name}
*Harga:* Rp ${selectedItem.price.toLocaleString("id-ID")}
*Jumlah:* ${formData.quantity}
*Ukuran/Varian:* ${formData.size}
*Nama Pemesan:* ${formData.buyerName}
*No. WhatsApp:* ${formData.buyerPhone}
*Catatan:* ${formData.notes || "-"}`;

    const url = `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setIsOrderModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#f8faff] text-gray-900 flex flex-col justify-between">
      <div>
        <Navigation />

        {/* Hero Header Banner */}
        <section className="relative pt-32 pb-20 bg-gradient-to-b from-[#0e2544] via-[#163967] to-[#1d4880] text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/15 via-transparent to-transparent pointer-events-none" />
          <div className="container-custom relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/15">
              <span>Merchandise</span>
              <span>&bull;</span>
              <span>Official Merch & Form to Order</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
              Official Merchandise
            </h1>
            <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed">
              Dapatkan merchandise resmi ALSA Local Chapter Universitas Sam Ratulangi
              dan pesan langsung melalui formulir pemesanan resmi.
            </p>
          </div>
        </section>

        {/* Merchandise Catalog */}
        <section className="section-spacing container-custom max-w-6xl py-14">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden border border-blue-50 shadow-[0_4px_25px_rgba(22,57,103,0.04)] flex flex-col justify-between"
                >
                  <div className="relative">
                    <Skeleton className="h-64 w-full rounded-none" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-5 w-3/4 rounded-md" />
                      <Skeleton className="h-3.5 w-full rounded-md" />
                      <Skeleton className="h-3.5 w-2/3 rounded-md" />
                      <div className="pt-2 flex items-center justify-between">
                        <Skeleton className="h-6 w-28 rounded-md" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <Skeleton className="h-11 w-full rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayMerch.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-blue-50 shadow-[0_4px_25px_rgba(22,57,103,0.04)] hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  {/* Image Container */}
                  <div className="h-64 w-full bg-gradient-to-tr from-slate-100 to-blue-50/50 overflow-hidden relative flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-blue-300">
                        <ShoppingBag size={56} strokeWidth={1.2} />
                        <span className="text-[11px] font-bold uppercase tracking-wider mt-2 text-blue-400">
                          Official Merch
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#163967] mb-2 leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold">
                          Price
                        </span>
                        <span className="text-base sm:text-lg font-extrabold text-[#163967]">
                          Rp {item.price.toLocaleString("id-ID")}
                        </span>
                      </div>

                      <button
                        onClick={() => handleOpenOrder(item)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#163967] hover:bg-[#112d52] text-white text-xs font-bold shadow-md transition-all cursor-pointer group"
                      >
                        <MessageCircle size={14} />
                        <span>Form to Order</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Form to Order Modal */}
      {isOrderModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
                Form to Order
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#163967]">
                Pemesanan Merchandise
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {selectedItem.name} &bull;{" "}
                <span className="font-bold text-[#163967]">
                  Rp {selectedItem.price.toLocaleString("id-ID")}
                </span>
              </p>
            </div>

            <form onSubmit={handleSendOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Nama Lengkap Pemesan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Nathania Kembuan"
                  value={formData.buyerName}
                  onChange={(e) =>
                    setFormData({ ...formData, buyerName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#163967]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Nomor WhatsApp Aktif
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={formData.buyerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, buyerPhone: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#163967]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Jumlah (Qty)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#163967]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Ukuran / Varian
                  </label>
                  <select
                    value={formData.size}
                    onChange={(e) =>
                      setFormData({ ...formData, size: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#163967] bg-white"
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="All Size">All Size</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Tambah bordir inisial, atau alamat kirim..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#163967]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#163967] hover:bg-[#112d52] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={15} />
                  <span>Kirim Pesanan ke WhatsApp Official</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}