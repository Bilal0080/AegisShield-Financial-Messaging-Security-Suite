import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Ban, 
  CheckCircle2, 
  Globe, 
  RefreshCw,
  ExternalLink,
  Shield,
  Zap,
  Lock
} from 'lucide-react';
import { scanUrl, PRESET_TEST_LINKS } from '../services/phishingDetector';
import { PhishingScanResult, ComplianceAuditLog } from '../types/security';

interface PhishingLinkScannerProps {
  onThreatBlocked: (result: PhishingScanResult) => void;
}

export const PhishingLinkScanner: React.FC<PhishingLinkScannerProps> = ({
  onThreatBlocked
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentResult, setCurrentResult] = useState<PhishingScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<PhishingScanResult[]>([
    scanUrl('https://whatsapp-secure-banking-auth.xyz/verify-account?token=89f92'),
    scanUrl('https://xn--chse-spa.com/online-banking-auth'),
    scanUrl('https://www.chase.com/personal/banking')
  ]);
  const [firewallSinkhole, setFirewallSinkhole] = useState<string[]>([
    'whatsapp-secure-banking-auth.xyz',
    'xn--chse-spa.com',
    'tt-creator-fund-bonus.top',
    '185.220.101.44'
  ]);

  const handleScan = (urlToScan?: string) => {
    const target = (urlToScan || inputUrl).trim();
    if (!target) return;

    setIsScanning(true);
    setTimeout(() => {
      const res = scanUrl(target);
      setCurrentResult(res);
      setScanHistory(prev => [res, ...prev.filter(item => item.url !== res.url)].slice(0, 10));
      setIsScanning(false);

      if (res.isThreat) {
        onThreatBlocked(res);
        if (!firewallSinkhole.includes(res.domain)) {
          setFirewallSinkhole(prev => [res.domain, ...prev]);
        }
      }
    }, 450);
  };

  const handleApplyPreset = (url: string) => {
    setInputUrl(url);
    handleScan(url);
  };

  const handleSinkholeDomain = (domain: string) => {
    if (!firewallSinkhole.includes(domain)) {
      setFirewallSinkhole(prev => [domain, ...prev]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <span>Phishing Detection Filters & Link Guardian</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Intercepts unknown and third-party links targeting WhatsApp banking, financial accounts, and employee credentials using multi-tier heuristics.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Active DNS Sinkhole: {firewallSinkhole.length} domains blocked</span>
        </div>
      </div>

      {/* Interactive Scanner Input */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 dark:bg-slate-900/60 light:bg-white light:border-slate-200 space-y-4">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Inspect Inbound URL or Messaging Link
        </label>
        
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              placeholder="Paste suspicious link (e.g. https://whatsapp-verify.xyz/login or http://192.168...)"
              className="w-full bg-slate-950 dark:bg-slate-950 light:bg-slate-50 border border-slate-700 dark:border-slate-700 light:border-slate-300 text-slate-100 dark:text-slate-100 light:text-slate-900 rounded-lg pl-10 pr-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => handleScan()}
            disabled={isScanning || !inputUrl.trim()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Deep Scanning...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Analyze Link</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Test Attacks */}
        <div className="pt-2">
          <span className="text-xs text-slate-400 block mb-2 font-medium">Quick Attack Scenarios:</span>
          <div className="flex flex-wrap gap-2">
            {PRESET_TEST_LINKS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleApplyPreset(preset.url)}
                className="px-3 py-1.5 text-xs bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 rounded-md border border-slate-700/60 transition-colors text-left"
                title={preset.description}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Analysis Breakdown */}
      {currentResult && (
        <div className={`p-6 rounded-xl border transition-all ${
          currentResult.isThreat
            ? 'border-rose-500/40 bg-rose-950/20'
            : 'border-emerald-500/40 bg-emerald-950/20'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg shrink-0 ${
                currentResult.isThreat ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {currentResult.isThreat ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">
                    {currentResult.isThreat ? 'CRITICAL THREAT: Phishing Detected' : 'VERIFIED SAFE: Low Risk Profile'}
                  </span>
                  <span className={`text-[11px] font-mono uppercase px-2 py-0.5 rounded border ${
                    currentResult.reputation === 'malicious'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : currentResult.reputation === 'suspicious'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  }`}>
                    {currentResult.actionTaken.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5 break-all">
                  {currentResult.url}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Risk Confidence</span>
                <span className={`text-2xl font-bold font-mono tabular-nums ${
                  currentResult.confidenceScore >= 70 ? 'text-rose-400' : currentResult.confidenceScore >= 40 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {currentResult.confidenceScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Diagnostic Heuristics Matrix */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Domain Entropy</span>
              <span className="text-sm font-semibold text-white mt-1 block">
                {currentResult.entropy} bits
              </span>
              <span className="text-[10px] text-slate-400">
                {currentResult.entropy > 3.8 ? 'Suspicious DGA' : 'Nominal range'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Punycode / Homoglyph</span>
              <span className="text-sm font-semibold mt-1 block text-white">
                {currentResult.hasPunycode ? (
                  <span className="text-rose-400">Detected (Masquerade)</span>
                ) : (
                  <span className="text-emerald-400">Clean ASCII</span>
                )}
              </span>
              <span className="text-[10px] text-slate-400">Unicode lookalike check</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Estimated Domain Age</span>
              <span className="text-sm font-semibold text-white mt-1 block">
                ~{currentResult.ageDaysEstimate} days
              </span>
              <span className="text-[10px] text-slate-400">
                {currentResult.ageDaysEstimate < 30 ? 'High-risk new domain' : 'Established reputation'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Spoof Target</span>
              <span className="text-sm font-semibold text-white mt-1 block">
                {currentResult.targetEntity || 'None (Generic)'}
              </span>
              <span className="text-[10px] text-slate-400">Brand mimicry classifier</span>
            </div>
          </div>

          {/* Triggered Filter Rules */}
          <div className="mt-5">
            <span className="text-xs font-semibold text-slate-300 block mb-2">
              Matched Heuristic Detection Rules:
            </span>
            {currentResult.matchedRules.length > 0 ? (
              <div className="space-y-1.5">
                {currentResult.matchedRules.map((rule, idx) => (
                  <div 
                    key={idx}
                    className="p-2 rounded bg-slate-900/80 border border-slate-800 text-xs font-mono text-rose-300 flex items-center justify-between"
                  >
                    <span>{rule}</span>
                    <span className="text-[10px] text-rose-400 uppercase tracking-wider">Filtered</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded bg-slate-900/40 text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Zero malicious signatures matched. Domain verified authentic.</span>
              </div>
            )}
          </div>

          {/* Action Row */}
          {currentResult.isThreat && (
            <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-rose-300 font-medium flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-400" />
                <span>Access blocked across enterprise WhatsApp Web & Web Banking sessions.</span>
              </div>
              <button
                onClick={() => handleSinkholeDomain(currentResult.domain)}
                className="px-3.5 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sinkhole Domain ({currentResult.domain})</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Historical Scans and Active Sinkhole Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Scans */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Recent Phishing Filter Activity</h3>
            <span className="text-xs text-slate-400">Live Inspection Log</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden divide-y divide-slate-800">
            {scanHistory.map((scan, i) => (
              <div key={i} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${scan.isThreat ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {scan.domain}
                    </span>
                    <span className="text-slate-500 text-xs">·</span>
                    <span className="text-xs text-slate-400 font-mono">
                      Risk: {scan.confidenceScore}%
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono truncate max-w-md">
                    {scan.url}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                    scan.isThreat
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  }`}>
                    {scan.actionTaken.replace(/_/g, ' ')}
                  </span>
                  <button
                    onClick={() => handleApplyPreset(scan.url)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                    title="Re-inspect"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DNS Sinkhole & Firewall Blacklist */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Ban className="w-4 h-4 text-rose-400" />
              <span>Firewall DNS Sinkhole</span>
            </h3>
            <span className="text-xs font-mono text-rose-400">{firewallSinkhole.length} entries</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <p className="text-xs text-slate-400">
              Domains routed to 127.0.0.1 (sinkhole) to prevent credential exfiltration from WhatsApp or banking sessions.
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {firewallSinkhole.map((dom) => (
                <div 
                  key={dom} 
                  className="p-2 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between"
                >
                  <span className="truncate">{dom}</span>
                  <span className="text-[10px] text-rose-400 font-mono shrink-0">BLOCKED</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
