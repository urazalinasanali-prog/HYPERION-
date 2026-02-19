import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { motion } from 'motion/react';
import { Monitor, Cpu, Mouse, Keyboard, Zap, Clock, Calendar, ShieldAlert, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types ---

type PricingRow = {
  Category: string; // e.g., "Standard", "VIP", "Premium"
  Period: string;   // e.g., "Mon-Thu", "Fri-Sun"
  Item: string;     // e.g., "1 Hour", "Morning", "Night"
  Price: string;    // e.g., "1000"
};

type HardwareSpec = {
  zone: string;
  monitor: string;
  gpu: string;
  keyboard: string;
  mouse: string;
};

// --- Constants ---

const HARDWARE_SPECS: HardwareSpec[] = [
  {
    zone: "Standard",
    monitor: "Zowie 240Hz",
    gpu: "RTX 4060",
    keyboard: "VGN N75 PRO",
    mouse: "VGN F1 S",
  },
  {
    zone: "Bootcamp / Squad / Duo / Trio",
    monitor: "Zowie 400Hz",
    gpu: "RTX 5070",
    keyboard: "VARMILO",
    mouse: "Logitech Superlight 2",
  },
];

const RULES = [
  "Посетители в состоянии алкогольного или наркотического опьянения не допускаются.",
  "Несовершеннолетним (до 18 лет) пребывание после 22:00 запрещено.",
  "В случае порчи имущества гость обязан возместить ущерб.",
  "С 22:00 до 07:00 соблюдаем тишину на улице.",
  "Администрация не несет ответственности за оставленные вещи.",
  "Курение (в т.ч. вейпов) в Standard зале запрещено.",
  "Возврат средств только при технических проблемах клуба.",
  "Администрация вправе отказать в обслуживании при нарушении правил.",
];

const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfHdsuUMWR23eJ67OodYlVZEeIHionMo4K_PH-xsiS8w0XlDFd3TmeBi_9EkYuV5ujEVIN7k-AP8Vu/pub?gid=0&single=true&output=csv";

const WHATSAPP_NUMBER = "77064052525";
const WHATSAPP_MESSAGE = "Здравствуйте! Хочу забронировать место в Hyperion";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-cyan-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold tracking-tighter text-white">
              HYPER<span className="text-cyan-400">ION</span>
            </span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#pricing" className="text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Цены</a>
              <a href="#bonuses" className="text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Бонусы</a>
              <a href="#hardware" className="text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Железо</a>
              <a href="#rules" className="text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Правила</a>
              <a 
                href={WHATSAPP_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold transition-all shadow-[0_0_15px_rgba(8,145,178,0.5)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]"
              >
                БРОНЬ
              </a>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-black border-b border-cyan-900/30">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#pricing" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-cyan-400 block px-3 py-2 rounded-md text-base font-medium">Цены</a>
            <a href="#bonuses" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-cyan-400 block px-3 py-2 rounded-md text-base font-medium">Бонусы</a>
            <a href="#hardware" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-cyan-400 block px-3 py-2 rounded-md text-base font-medium">Железо</a>
            <a href="#rules" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-cyan-400 block px-3 py-2 rounded-md text-base font-medium">Правила</a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-cyan-400 block px-3 py-2 rounded-md text-base font-bold">ЗАБРОНИРОВАТЬ</a>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter text-white mb-6"
        >
          HYPER<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">ION</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto font-light"
        >
          Игровое пространство нового уровня. <br/>
          <span className="text-cyan-400 font-medium">RTX 4060</span> & <span className="text-cyan-400 font-medium">RTX 5070</span>
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a 
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black bg-cyan-400 rounded-full hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transform hover:-translate-y-1"
          >
            <Zap className="w-5 h-5 mr-2 fill-current" />
            ЗАБРОНИРОВАТЬ МЕСТО
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const Bonuses = () => {
  const bonuses = [
    { deposit: 5000, gift: 2500 },
    { deposit: 10000, gift: 7500 },
    { deposit: 20000, gift: 20000 },
  ];

  return (
    <section id="bonuses" className="py-24 bg-black relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-black pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4 uppercase">Бонусы</h2>
                <p className="text-zinc-400 uppercase tracking-widest">Получай бонусы и участвуй в колесе фортуны</p>
                <div className="w-24 h-1 bg-purple-500 mx-auto rounded-full mt-6"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {bonuses.map((bonus, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <div className="relative bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center hover:border-purple-500/50 transition-colors h-full flex flex-col justify-center">
                            <p className="text-zinc-400 text-sm uppercase tracking-wider mb-2">При пополнении</p>
                            <p className="text-4xl font-black text-white mb-6">{bonus.deposit}</p>
                            
                            <div className="text-purple-400 font-bold text-5xl mb-2">+{bonus.gift}</div>
                            <p className="text-zinc-500 text-sm uppercase tracking-wider">В подарок</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  );
};

const BookingModal = ({ 
  isOpen, 
  onClose, 
  item 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  item: PricingRow | null 
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Helper to get formatted date string YYYY-MM-DD
  const getTodayString = () => new Date().toISOString().split('T')[0];
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (isOpen) {
        setDate(getTodayString());
        const now = new Date();
        now.setMinutes(now.getMinutes() + 30); // +30 mins
        // Format HH:MM
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        setTime(`${hours}:${minutes}`);
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const handleBook = () => {
    const message = `Здравствуйте! Хочу забронировать:
    
📍 Зона: ${item.Category}
🎮 Тариф: ${item.Item} (${item.Period})
📅 Дата: ${date || 'Не указана'}
⏰ Время: ${time || 'Не указано'}
💰 Цена: ${item.Price} ₸`;

    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(link, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-bold text-white mb-2">Бронирование</h3>
        <p className="text-zinc-400 mb-6">
          {item.Category} • {item.Item} <span className="text-cyan-500">({item.Price} ₸)</span>
        </p>

        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Дата бронирования</label>
            <div className="flex space-x-2 mb-3">
                <button
                    onClick={() => setDate(getTodayString())}
                    className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-medium transition-colors border",
                        date === getTodayString()
                            ? "bg-cyan-900/30 border-cyan-500 text-cyan-400"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700"
                    )}
                >
                    Сегодня
                </button>
                <button
                    onClick={() => setDate(getTomorrowString())}
                    className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-medium transition-colors border",
                        date === getTomorrowString()
                            ? "bg-cyan-900/30 border-cyan-500 text-cyan-400"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700"
                    )}
                >
                    Завтра
                </button>
            </div>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-white text-lg focus:outline-none focus:border-cyan-500 transition-colors [color-scheme:dark]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Время начала</label>
            <div className="flex space-x-2 mb-3">
                <button
                    onClick={() => {
                        const now = new Date();
                        now.setMinutes(now.getMinutes() + 15);
                        const h = String(now.getHours()).padStart(2, '0');
                        const m = String(now.getMinutes()).padStart(2, '0');
                        setTime(`${h}:${m}`);
                    }}
                    className="flex-1 py-2 rounded-lg text-sm font-medium bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                    Сейчас
                </button>
                <button
                    onClick={() => setTime('18:00')}
                    className="flex-1 py-2 rounded-lg text-sm font-medium bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                    18:00
                </button>
                <button
                    onClick={() => setTime('22:00')}
                    className="flex-1 py-2 rounded-lg text-sm font-medium bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                    22:00
                </button>
            </div>
            <div className="relative">
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-white text-2xl font-bold tracking-widest text-center focus:outline-none focus:border-cyan-500 transition-colors appearance-none [color-scheme:dark]"
                />
                <Clock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500 pointer-events-none w-6 h-6" />
            </div>
          </div>
        </div>

        <button
          onClick={handleBook}
          disabled={!date || !time}
          className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] flex items-center justify-center space-x-2"
        >
          <span>Перейти в WhatsApp</span>
          <Zap className="w-5 h-5 fill-current" />
        </button>
      </motion.div>
    </div>
  );
};

const Pricing = () => {
  const [pricingData, setPricingData] = useState<PricingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Standard' | 'VIP' | 'Premium'>('Standard');
  const [activePeriod, setActivePeriod] = useState<'Mon-Thu' | 'Fri-Sun'>('Mon-Thu');
  const [selectedItem, setSelectedItem] = useState<PricingRow | null>(null);

  useEffect(() => {
    Papa.parse(GOOGLE_SHEET_URL, {
      download: true,
      header: true,
      complete: (results) => {
        // If sheet is empty or fails, we use fallback data
        if (results.data && results.data.length > 0) {
           // Basic validation to ensure it looks like our data
           const hasRequiredKeys = 'Category' in results.data[0] && 'Price' in results.data[0];
           if (hasRequiredKeys) {
             setPricingData(results.data as PricingRow[]);
           } else {
             console.warn("CSV format mismatch, using fallback");
             setPricingData(FALLBACK_PRICING);
           }
        } else {
          setPricingData(FALLBACK_PRICING);
        }
        setLoading(false);
      },
      error: () => {
        setPricingData(FALLBACK_PRICING);
        setLoading(false);
      }
    });
  }, []);

  // Fallback data based on images
  const FALLBACK_PRICING: PricingRow[] = [
    // Standard Mon-Thu
    { Category: 'Standard', Period: 'Mon-Thu', Item: '1 Час', Price: '1000' },
    { Category: 'Standard', Period: 'Mon-Thu', Item: '2+1', Price: '2000' },
    { Category: 'Standard', Period: 'Mon-Thu', Item: '3+2', Price: '2900' },
    { Category: 'Standard', Period: 'Mon-Thu', Item: 'Утро (08:00-14:00)', Price: '1200' },
    { Category: 'Standard', Period: 'Mon-Thu', Item: 'День (12:00-18:00)', Price: '2200' },
    { Category: 'Standard', Period: 'Mon-Thu', Item: 'Ночь (22:00-08:00)', Price: '3500' },
    { Category: 'Standard', Period: 'Mon-Thu', Item: 'Ультра Ночь (01:00-10:00)', Price: '3000' },
    { Category: 'Standard', Period: 'Mon-Thu', Item: 'Полный День (08:00-18:00)', Price: '2700' },
    // Standard Fri-Sun
    { Category: 'Standard', Period: 'Fri-Sun', Item: '1 Час', Price: '1100' },
    { Category: 'Standard', Period: 'Fri-Sun', Item: '2+1', Price: '2200' },
    { Category: 'Standard', Period: 'Fri-Sun', Item: '3+2', Price: '3200' },
    { Category: 'Standard', Period: 'Fri-Sun', Item: 'Утро (08:00-14:00)', Price: '1400' },
    { Category: 'Standard', Period: 'Fri-Sun', Item: 'День (12:00-18:00)', Price: '2400' },
    { Category: 'Standard', Period: 'Fri-Sun', Item: 'Ночь (22:00-08:00)', Price: '3900' },
    { Category: 'Standard', Period: 'Fri-Sun', Item: 'Ультра Ночь (01:00-10:00)', Price: '3300' },
    { Category: 'Standard', Period: 'Fri-Sun', Item: 'Полный День (08:00-18:00)', Price: '3000' },
    // VIP Mon-Thu
    { Category: 'VIP', Period: 'Mon-Thu', Item: '1 Час', Price: '1800' },
    { Category: 'VIP', Period: 'Mon-Thu', Item: '2+1', Price: '3600' },
    { Category: 'VIP', Period: 'Mon-Thu', Item: '3+2', Price: '4800' },
    { Category: 'VIP', Period: 'Mon-Thu', Item: 'Утро (08:00-14:00)', Price: '1600' },
    { Category: 'VIP', Period: 'Mon-Thu', Item: 'День (12:00-18:00)', Price: '2400' },
    { Category: 'VIP', Period: 'Mon-Thu', Item: 'Ночь (22:00-08:00)', Price: '7000' },
    { Category: 'VIP', Period: 'Mon-Thu', Item: 'Ультра Ночь (01:00-10:00)', Price: '6000' },
    { Category: 'VIP', Period: 'Mon-Thu', Item: 'Полный День (08:00-18:00)', Price: '3600' },
    // VIP Fri-Sun
    { Category: 'VIP', Period: 'Fri-Sun', Item: '1 Час', Price: '2000' },
    { Category: 'VIP', Period: 'Fri-Sun', Item: '2+1', Price: '4000' },
    { Category: 'VIP', Period: 'Fri-Sun', Item: '3+2', Price: '5300' },
    { Category: 'VIP', Period: 'Fri-Sun', Item: 'Утро (08:00-14:00)', Price: '1800' },
    { Category: 'VIP', Period: 'Fri-Sun', Item: 'День (12:00-18:00)', Price: '3200' },
    { Category: 'VIP', Period: 'Fri-Sun', Item: 'Ночь (22:00-08:00)', Price: '7700' },
    { Category: 'VIP', Period: 'Fri-Sun', Item: 'Ультра Ночь (01:00-10:00)', Price: '6600' },
    { Category: 'VIP', Period: 'Fri-Sun', Item: 'Полный День (08:00-18:00)', Price: '4000' },
    // Premium Fri-Sun (Assuming similar structure, image 12 only shows one column, likely Fri-Sun or Mon-Thu? Let's assume Fri-Sun based on price hike or just general Premium)
    // Actually Image 12 says "Juma - Jeksenbi" at the bottom.
    { Category: 'Premium', Period: 'Fri-Sun', Item: '1 Час', Price: '2900' },
    { Category: 'Premium', Period: 'Fri-Sun', Item: '2+1', Price: '5800' },
    { Category: 'Premium', Period: 'Fri-Sun', Item: '3+2', Price: '8000' },
    { Category: 'Premium', Period: 'Fri-Sun', Item: 'Утро (08:00-14:00)', Price: '2600' },
    { Category: 'Premium', Period: 'Fri-Sun', Item: 'День (12:00-18:00)', Price: '4200' },
    { Category: 'Premium', Period: 'Fri-Sun', Item: 'Ночь (22:00-08:00)', Price: '9800' },
    { Category: 'Premium', Period: 'Fri-Sun', Item: 'Ультра Ночь (01:00-10:00)', Price: '8000' },
    { Category: 'Premium', Period: 'Fri-Sun', Item: 'Полный День (08:00-18:00)', Price: '4800' },
     // Premium Mon-Thu (Inferred or missing? I'll leave it empty or clone with discount if needed, but for now I'll just show what I have. If user clicks Mon-Thu for Premium, I might show "Нет данных" or just show Fri-Sun prices if that's all there is. Let's assume Premium is always high end. I'll just duplicate Fri-Sun for Mon-Thu with a slight discount for now to fill the UI, or better yet, just hide the toggle if data is missing. But to be safe, I'll add a placeholder or just use the same data if I don't have it.)
     // Actually, let's just use the same data for Premium Mon-Thu but maybe 10% cheaper? No, better not to invent prices. I will only show what is in the images.
     // Wait, I can just not render rows if they don't exist.
  ];

  const filteredData = pricingData.filter(row => 
    row.Category === activeTab && 
    (row.Period === activePeriod || (activeTab === 'Premium' && row.Period === 'Fri-Sun' && activePeriod === 'Mon-Thu')) // Fallback for Premium
  );

  return (
    <section id="pricing" className="py-24 bg-zinc-950 relative">
      <BookingModal 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        item={selectedItem} 
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">ПРАЙС-ЛИСТ</h2>
          <div className="w-24 h-1 bg-cyan-500 mx-auto rounded-full"></div>
        </div>

        {/* Zone Tabs */}
        <div className="flex justify-center mb-8 space-x-2 sm:space-x-4">
          {(['Standard', 'VIP', 'Premium'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2 rounded-full text-sm sm:text-base font-bold transition-all border",
                activeTab === tab
                  ? "bg-cyan-500 border-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                  : "bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
              )}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Period Tabs */}
        <div className="flex justify-center mb-12 bg-zinc-900/50 p-1 rounded-xl w-fit mx-auto border border-zinc-800">
          <button
            onClick={() => setActivePeriod('Mon-Thu')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-medium transition-all",
              activePeriod === 'Mon-Thu'
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            ПН - ЧТ
          </button>
          <button
            onClick={() => setActivePeriod('Fri-Sun')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-medium transition-all",
              activePeriod === 'Fri-Sun'
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            ПТ - ВС
          </button>
        </div>

        {/* Pricing Grid */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center text-cyan-400">Загрузка цен...</div>
          ) : (
            filteredData.map((row, index) => (
              <motion.div
                key={index}
                onClick={() => setSelectedItem(row)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-cyan-500 hover:bg-zinc-800/80 transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-zinc-800 rounded-lg text-cyan-400 group-hover:text-cyan-300 group-hover:bg-zinc-700 transition-colors">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-gray-200 font-medium group-hover:text-white transition-colors">{row.Item}</span>
                </div>
                <div className="text-xl font-bold text-white font-mono group-hover:text-cyan-400 transition-colors">
                  {row.Price} <span className="text-sm text-zinc-500 font-sans font-normal group-hover:text-cyan-600">₸</span>
                </div>
              </motion.div>
            ))
          )}
          {filteredData.length === 0 && (
             <div className="text-center text-zinc-500 py-10">Нет данных для выбранного периода</div>
          )}
        </div>
      </div>
    </section>
  );
};

const Hardware = () => {
  return (
    <section id="hardware" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-900 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">ЖЕЛЕЗО</h2>
          <p className="text-zinc-400">Топовое оборудование для максимального FPS</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {HARDWARE_SPECS.map((spec, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 hover:border-cyan-500/30 hover:bg-zinc-900/50 transition-all group"
            >
              <h3 className="text-2xl font-bold text-white mb-8 border-b border-zinc-800 pb-4 group-hover:border-cyan-500/30 transition-colors">
                {spec.zone}
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Monitor className="w-6 h-6 text-cyan-400 mt-1" />
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Монитор</p>
                    <p className="text-lg text-white font-medium">{spec.monitor}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Cpu className="w-6 h-6 text-cyan-400 mt-1" />
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Видеокарта</p>
                    <p className="text-lg text-white font-medium">{spec.gpu}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Keyboard className="w-6 h-6 text-cyan-400 mt-1" />
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Клавиатура</p>
                    <p className="text-lg text-white font-medium">{spec.keyboard}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mouse className="w-6 h-6 text-cyan-400 mt-1" />
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Мышь</p>
                    <p className="text-lg text-white font-medium">{spec.mouse}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Rules = () => {
  return (
    <section id="rules" className="py-24 bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-12 space-x-3">
          <ShieldAlert className="w-8 h-8 text-cyan-500" />
          <h2 className="text-3xl font-bold text-white">ПРАВИЛА КЛУБА</h2>
        </div>
        
        <div className="grid gap-4">
          {RULES.map((rule, i) => (
            <div key={i} className="flex items-start space-x-4 p-4 bg-zinc-900 rounded-lg border border-zinc-800/50">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-900/30 text-cyan-400 flex items-center justify-center text-sm font-bold border border-cyan-800/30">
                {i + 1}
              </span>
              <p className="text-zinc-300 text-sm md:text-base">{rule}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black border-t border-zinc-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <span className="text-2xl font-bold tracking-tighter text-white">
            HYPER<span className="text-cyan-400">ION</span>
          </span>
          <p className="text-zinc-500 mt-2 text-sm">
            © {new Date().getFullYear()} Hyperion Computer Club. All rights reserved.
          </p>
        </div>
        
        <div className="flex flex-col items-center md:items-end space-y-4">
            <p className="text-zinc-400">г. Алматы</p>
            <a 
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-white hover:text-cyan-400 transition-colors"
            >
              <span className="font-mono text-lg">+7 706 405 25 25</span>
            </a>
        </div>
      </div>
    </footer>
  );
};

const FloatingWhatsApp = () => {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center"
      aria-label="Contact on WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500 selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <Pricing />
        <Bonuses />
        <Hardware />
        <Rules />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
