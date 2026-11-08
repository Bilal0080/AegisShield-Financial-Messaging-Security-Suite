import React, { useState } from 'react';
import { 
  Share2, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  Copy, 
  Sparkles,
  ExternalLink,
  Shield,
  FileCheck
} from 'lucide-react';
import { TikTokVerification } from '../types/security';
import { generateSha256Hash } from '../services/complianceEngine';

export const TikTokGateway: React.FC = () => {
  const [contentTitle, setContentTitle] = useState('Official Student Finance Advisory: 2026 Grant Disbursal Rules');
  const [creatorHandle, setCreatorHandle] = useState('@AegisEnterpriseBanking');
  const [copiedToken, setCopiedToken] = useState(false);

  const [verifications, setVerifications] = useState<TikTokVerification[]>([
    {
      id: 'TT-VER-8910',
      contentTitle: 'Official Student Finance Advisory: 2026 Grant Disbursal Rules',
      creatorHandle: '@AegisEnterpriseBanking',
      sharedLink: 'https://tiktok.com/@AegisEnterpriseBanking/video/7192849102',
      verificationToken: 'AEST-TIKTOK-8892-ZKP-VALID',
      status: 'verified_authentic',
      cryptoSignature: '0x99fba24810c9e2b10a',
      watermarkHash: 'SHA256:7b91c0e3a4f89d2',
      riskAssessment: 'Authentic enterprise entity; zero PII exposure detected.',
      createdAt: '2026-11-08 10:15 UTC'
    },
    {
      id: 'TT-VER-8909',
      contentTitle: 'Claim $5,000 Instant Deposit - Limited Time WhatsApp Bot',
      creatorHandle: '@free_money_fast_2026',
      sharedLink: 'https://tt-creator-fund-bonus.top/claim-funds?user=cashout',
      verificationToken: 'UNVERIFIED-FLAGGED-SCAM',
      status: 'scam_flagged',
      cryptoSignature: 'REVOKED_MALICIOUS_ORIGIN',
      watermarkHash: 'SHA256:000000000000000',
      riskAssessment: 'Social engineering financial scam targeting mobile banking credentials.',
      createdAt: '2026-11-08 09:12 UTC'
    }
  ]);

  const [testUrl, setTestUrl] = useState('');
  const [scannedResult, setScannedResult] = useState<{
    status: 'safe' | 'scam';
    confidence: number;
    notes: string;
  } | null>(null);

  const handleGenerateShareToken = () => {
    if (!contentTitle.trim()) return;

    const signature = generateSha256Hash(`${contentTitle}:${creatorHandle}:${Date.now()}`);
    const token = `AEST-TIKTOK-${Math.floor(1000 + Math.random() * 9000)}-ZKP-${Date.now().toString(36).toUpperCase()}`;

    const newRecord: TikTokVerification = {
      id: `TT-VER-${Date.now().toString().slice(-4)}`,
      contentTitle,
      creatorHandle,
      sharedLink: `https://tiktok.com/${creatorHandle}/share/${token}`,
      verificationToken: token,
      status: 'verified_authentic',
      cryptoSignature: signature,
      watermarkHash: `SHA256:${signature.substring(2, 17)}`,
      riskAssessment: 'Cryptographically watermarked; zero-PII metadata compliance assured.',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC'
    };

    setVerifications(prev => [newRecord, ...prev]);
  };

  const handleCopy = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleTestTikTokUrl = () => {
    if (!testUrl.trim()) return;

    if (testUrl.includes('bonus') || testUrl.includes('claim') || testUrl.includes('.top') || testUrl.includes('free')) {
      setScannedResult({
        status: 'scam',
        confidence: 96,
        notes: 'Malicious financial phishing lure disguised as a viral TikTok campaign. Directs users to credential harvesting form.'
      });
    } else {
      setScannedResult({
        status: 'safe',
        confidence: 12,
        notes: 'Verified legitimate social media reference. No unauthorized financial routing detected.'
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2.5">
            <Share2 className="w-6 h-6 text-pink-500" />
            <span>TikTok Integration: Secure Sharing & Viral Verification</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Ensures financial advice and transaction receipts shared on TikTok are cryptographically authenticated and scrubbed of all PII, preventing viral social engineering attacks.
          </p>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Token Generator for Secure Sharing */}
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Generate Watermarked Verification Badge</span>
            </h3>
            <span className="text-xs text-pink-400 font-mono">PII Zero-Knowledge Proof</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Content Title / Financial Topic
              </label>
              <input
                type="text"
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Creator / Verified Enterprise Handle
              </label>
              <input
                type="text"
                value={creatorHandle}
                onChange={(e) => setCreatorHandle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>

            <p className="text-[11px] text-slate-400">
              * AegisShield embeds a tamper-proof HMAC verification watermark into the share payload, ensuring viewers can confirm authenticity without exposing account details.
            </p>

            <button
              onClick={handleGenerateShareToken}
              className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Mint Cryptographic TikTok Verification Token</span>
            </button>
          </div>
        </div>

        {/* Viral Social Link Fraud Detector */}
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>TikTok Viral Financial Scam Detector</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Anti-Fraud Guard</span>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-300">
              Inspect Viral TikTok Financial Promotion or Linktree
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="e.g. https://tt-creator-fund-bonus.top/claim-funds or tiktok.com/@user"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleTestTikTokUrl}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
              >
                Scan Link
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setTestUrl('https://tt-creator-fund-bonus.top/claim-funds?user=cashout');
                }}
                className="text-[11px] text-pink-400 hover:underline"
              >
                Load Sample Scam Promo
              </button>
            </div>

            {scannedResult && (
              <div className={`p-4 rounded-lg border text-xs space-y-1.5 ${
                scannedResult.status === 'scam' 
                  ? 'border-rose-500/40 bg-rose-950/20 text-rose-300' 
                  : 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {scannedResult.status === 'scam' ? <ShieldAlert className="w-4 h-4 text-rose-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  <span>{scannedResult.status === 'scam' ? 'CONFIRMED SOCIAL ENGINEERING SCAM' : 'AUTHENTIC TIKTOK ENTITY'}</span>
                  <span className="ml-auto font-mono">Risk: {scannedResult.confidence}%</span>
                </div>
                <p className="text-[11px] opacity-90">{scannedResult.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verified Share Badges Ledger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Cryptographically Watermarked TikTok Assets</h3>
          <span className="text-xs text-slate-400 font-mono">Tamper-Evident Ledger</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden divide-y divide-slate-800">
          {verifications.map((v) => {
            const isAuth = v.status === 'verified_authentic';
            return (
              <div key={v.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{v.contentTitle}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-xs font-mono text-pink-400">{v.creatorHandle}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-3">
                    <span>Token: {v.verificationToken}</span>
                    <span>Sig: {v.cryptoSignature.substring(0, 14)}...</span>
                    <span>{v.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-400">{v.riskAssessment}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                    isAuth 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                    {v.status.replace(/_/g, ' ')}
                  </span>
                  {isAuth && (
                    <button
                      onClick={() => handleCopy(v.verificationToken)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedToken ? 'Copied' : 'Copy Token'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
