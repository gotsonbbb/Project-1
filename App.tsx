
import React, { useState, useEffect } from 'react';
import ProductForm from './components/ProductForm';
import ContentDisplay from './components/ContentDisplay';
import ImageGenerator from './components/ImageGenerator';
import LogoGenerator from './components/LogoGenerator';
import HistoryList from './components/HistoryList';
import ActivityLog from './components/ActivityLog';
import GmailSettings from './components/GmailSettings';
import { MarketingPlan, LoadingState, HistoryItem } from './types';
import { generateMarketingContent } from './geminiService';

const App: React.FC = () => {
  const [marketingPlan, setMarketingPlan] = useState<MarketingPlan | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [sourceImage, setSourceImage] = useState<{ data: string; mimeType: string } | undefined>();
  const [logs, setLogs] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGmailOpen, setIsGmailOpen] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('app_history');
    if (saved) setHistory(JSON.parse(saved));
    const savedEmail = localStorage.getItem('rehit_user_gmail');
    if (savedEmail) setEmail(savedEmail);
    
    addLog("✨ Marketing support PRO Version 4.0 အား စတင်လိုက်ပါပြီ။");
  }, []);

  const addLog = (msg: string) => setLogs(p => [`${new Date().toLocaleTimeString()} - ${msg}`, ...p.slice(0, 49)]);

  const handleFormSubmit = async (input: { link?: string; image?: { data: string; mimeType: string }; price?: string; phone?: string; }) => {
    setLoadingState(LoadingState.ANALYZING);
    setMarketingPlan(null);
    setImageUrl(undefined);
    setSourceImage(input.image);
    addLog(`🚀 ${input.link ? 'လင့်ခ်' : 'ပုံ'}ကို AI မှ စစ်ဆေးနေပါသည်...`);

    try {
      const plan = await generateMarketingContent(input);
      setMarketingPlan(plan);
      addLog("✅ အောင်မြင်ပါသည်။ အရောင်းဗျူဟာများ ဖန်တီးပြီးပါပြီ။");
      
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        productName: plan.productName,
        productLink: input.link || '',
        plan,
        status: 'DRAFT'
      };
      
      const updatedHistory = [newItem, ...history.slice(0, 19)];
      setHistory(updatedHistory);
      localStorage.setItem('app_history', JSON.stringify(updatedHistory));
      setLoadingState(LoadingState.COMPLETE);
    } catch (error) {
      console.error(error);
      setLoadingState(LoadingState.ERROR);
      addLog("❌ အမှားတစ်ခု ဖြစ်သွားပါသည်၊ ပြန်ကြိုးစားပေးပါ။");
    }
  };

  const clearHistory = () => {
    if (confirm('မှတ်တမ်းများကို ဖျက်ရန် သေချာပါသလား?')) {
      setHistory([]);
      localStorage.removeItem('app_history');
      addLog("🗑️ မှတ်တမ်းများအားလုံးကို ရှင်းလင်းလိုက်ပါပြီ။");
    }
  };

  const selectHistoryItem = (item: HistoryItem) => {
    setMarketingPlan(item.plan);
    setImageUrl(item.imageUrl);
    setSourceImage(undefined);
    setIsHistoryOpen(false);
    addLog(`📂 "${item.productName}" မှတ်တမ်းကို ပြန်ဖွင့်လိုက်သည်။`);
  };

  return (
    <div className="min-h-screen luxury-bg text-slate-900 pb-20">
      {/* Navigation Header */}
      <header className="sticky top-0 z-[100] glass-panel border-b border-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl rotate-3">
             <span className="text-xl font-black">M</span>
          </div>
          <h1 className="text-xl font-black tracking-tighter">Marketing <span className="text-indigo-600">support</span></h1>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setIsGmailOpen(true)}
            className="p-3 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all active:scale-95 flex items-center gap-2"
            title="Gmail Settings"
          >
            📧 <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Gmail</span>
          </button>
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="p-3 bg-slate-900 text-white rounded-xl shadow-xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-2"
          >
            📋 <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">History</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Controls */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="sidebar-command rounded-[2.5rem] p-8 shadow-2xl">
            <ProductForm onSubmit={handleFormSubmit} isLoading={loadingState === LoadingState.ANALYZING} />
          </div>
          <LogoGenerator />
          <ActivityLog logs={logs} />
        </aside>

        {/* Right Side: Results */}
        <section className="lg:col-span-8 space-y-8">
          {marketingPlan ? (
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
              <ContentDisplay plan={marketingPlan} />
              <ImageGenerator 
                productName={marketingPlan.productName} 
                initialImageUrl={imageUrl}
                sourceImage={sourceImage}
                onImageGenerated={(url) => {
                  setImageUrl(url);
                  const newHistory = history.map(h => 
                    h.productName === marketingPlan.productName ? { ...h, imageUrl: url } : h
                  );
                  setHistory(newHistory);
                  localStorage.setItem('app_history', JSON.stringify(newHistory));
                }}
              />
            </div>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white/50 rounded-[3rem] border-4 border-dashed border-slate-200">
               <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl mb-8 animate-bounce">🛍️</div>
               <h2 className="text-3xl font-black text-slate-800 mb-4">လုပ်ငန်းစတင်ရန် အဆင်သင့်ပါ</h2>
               <p className="text-slate-500 font-medium max-w-sm">Amazon Link သို့မဟုတ် ပစ္စည်းဓာတ်ပုံကို ဘယ်ဘက်ခြမ်းတွင် ထည့်သွင်းပေးပါ။ AI မှ သင့်အတွက် အကောင်းဆုံး အရောင်းဗျူဟာများ ဖန်တီးပေးပါလိမ့်မည်။</p>
            </div>
          )}
        </section>
      </main>

      {/* History Sidebar Overlay */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsHistoryOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-300">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black">Saved History</h3>
                <button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">✕</button>
             </div>
             <HistoryList history={history} onSelectItem={selectHistoryItem} onClear={clearHistory} />
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isGmailOpen && (
        <GmailSettings onEmailChange={setEmail} onClose={() => setIsGmailOpen(false)} />
      )}
    </div>
  );
};

export default App;
