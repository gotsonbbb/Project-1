
import React, { useState } from 'react';
import { MarketingPlan } from '../types';

const ContentDisplay: React.FC<{ plan: MarketingPlan }> = ({ plan }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const safeCaption = plan?.postCaption || "စာသားများကို AI က ရေးသားနေဆဲဖြစ်ပါသည်...";
  const safeHashtags = Array.isArray(plan?.hashtags) ? plan.hashtags : [];
  const safeProductName = plan?.productName || "Product";
  const safeStrategy = plan?.strategyAdvice || "ဗျူဟာများကို ပြင်ဆင်နေပါသည်...";
  const safeTime = plan?.postingTimeSuggestion || "အချိန်မရွေး";
  const safeScript = plan?.videoScript || "Video script ကို ဖန်တီးနေဆဲဖြစ်ပါသည်...";
  const safeSources = Array.isArray(plan?.sources) ? plan.sources : [];

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: safeProductName,
          text: `${safeCaption}\n\n${safeHashtags.join(' ')}`,
        });
      } catch (err) {
        console.log("Share failed", err);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            <span className="gold-3d-text block text-sm uppercase tracking-[0.4em] mb-2 font-black">AI Report</span>
            {safeProductName}
          </h2>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleShare}
            className="flex-1 md:flex-none p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95"
            title="Share to other apps"
          >
            🚀
          </button>
          <button 
            onClick={() => copy(`${safeCaption}\n\n${safeHashtags.join(' ')}`, 'all')}
            className={`flex-1 md:flex-none px-8 py-4 ${copiedId === 'all' ? 'bg-green-600' : 'bg-slate-900'} text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95`}
          >
            {copiedId === 'all' ? '✓ Copied' : '📋 Copy All'}
          </button>
        </div>
      </div>

      {/* Main Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Facebook Post */}
        <div className="lg:col-span-8 glass-panel rounded-[2.5rem] shadow-xl border border-white overflow-hidden group">
          <div className="bg-slate-900 p-6 flex justify-between items-center">
            <h3 className="text-white font-black text-[10px] tracking-[0.3em] uppercase flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Viral Post Content
            </h3>
            <div className="flex gap-2">
              <button onClick={() => window.open('https://facebook.com', '_blank')} className="text-white hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
            </div>
          </div>
          <div className="p-8 md:p-10">
            <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 shadow-inner mb-8 relative group">
              <p className="whitespace-pre-line text-slate-800 font-bold leading-relaxed text-lg md:text-xl selection:bg-indigo-100">
                {safeCaption}
              </p>
              <button 
                onClick={() => copy(safeCaption, 'caption')}
                className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copiedId === 'caption' ? '✅' : '📋'}
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-10">
              {safeHashtags.map((h, i) => (
                <span key={i} className="text-[10px] font-black text-indigo-600 bg-indigo-50/50 px-4 py-2.5 rounded-xl border border-indigo-100/50">
                  {h}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                <h4 className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Ideal Schedule</h4>
                <p className="text-slate-700 font-black">{safeTime}</p>
              </div>
              <div className="p-6 bg-green-50/50 rounded-3xl border border-green-100/50">
                <h4 className="text-[9px] font-black text-green-400 uppercase tracking-widest mb-2">Market Status</h4>
                <p className="text-slate-700 font-black">Ready to Publish</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-8 rounded-[2.5rem] border border-white shadow-lg">
             <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
               <span className="p-1.5 bg-yellow-100 text-yellow-600 rounded-lg">💡</span>
               Messenger Strategy
             </h4>
             <p className="text-slate-600 text-sm font-bold leading-relaxed">{safeStrategy}</p>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
             <div className="flex justify-between items-start mb-4">
               <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">TikTok/Reels</h4>
               <button onClick={() => copy(safeScript, 'script')} className="text-slate-400 hover:text-white transition-colors">
                  {copiedId === 'script' ? '✅' : '📋'}
               </button>
             </div>
             <p className="text-indigo-100 text-[11px] font-mono leading-loose">{safeScript}</p>
          </div>
        </div>
      </div>

      {safeSources.length > 0 && (
        <div className="p-8 glass-panel rounded-[2.5rem] border border-white/50">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Referenced Data Sources</h4>
          <div className="flex flex-col gap-2">
            {safeSources.map((url, idx) => (
              <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-500 hover:text-indigo-600 font-bold truncate p-3 bg-white/50 rounded-xl border border-slate-100 transition-all hover:translate-x-1">
                {idx + 1}. {url}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentDisplay;
