import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  ShieldAlert, 
  Smartphone, 
  QrCode, 
  Key, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  Ban, 
  RefreshCw,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { WhatsAppMessage, WhatsAppSession, PhishingScanResult } from '../types/security';
import { scanUrl } from '../services/phishingDetector';

interface WhatsAppMonitorProps {
  onThreatIntercepted: (res: PhishingScanResult) => void;
}

export const WhatsAppMonitor: React.FC<WhatsAppMonitorProps> = ({
  onThreatIntercepted
}) => {
  const [session, setSession] = useState<WhatsAppSession>({
    sessionId: 'WA-SEC-2026-9921',
    deviceName: 'Enterprise Treasury MacBook Pro',
    os: 'macOS Sonoma 14.6 (Encrypted Enclave)',
    ipAddress: '198.51.100.45',
    location: 'Corporate HQ (Secured Gateway)',
    qrVerifiedAt: '2026-11-08 09:00:00 UTC',
    e2eeProtocol: 'Signal_v3_DoubleRatchet',
    keyExchange: 'Curve25519_ECDH',
    cipherSuite: 'AES-256-GCM_HMAC_SHA256',
    ratchetStep: 149,
    forwardSecrecy: true,
    status: 'connected_encrypted',
    interceptedThreatsCount: 3
  });

  const [chatMessages, setChatMessages] = useState<WhatsAppMessage[]>([
    {
      id: 'MSG-001',
      sender: 'Marcus Vance (CFO)',
      senderNumber: '+1 (555) 019-2834',
      timestamp: '11:15 AM',
      content: 'Can you please review the Q4 financial audit before the board meeting?',
      hasLink: false,
      isEncrypted: true,
      intercepted: false
    },
    {
      id: 'MSG-002',
      sender: 'Unknown Sender (+44 7700 900123)',
      senderNumber: '+44 7700 900123',
      timestamp: '11:42 AM',
      content: 'URGENT: WhatsApp banking security update required to prevent account freeze: https://whatsapp-secure-banking-auth.xyz/verify-account?token=89f92',
      hasLink: true,
      linkUrl: 'https://whatsapp-secure-banking-auth.xyz/verify-account?token=89f92',
      scanResult: scanUrl('https://whatsapp-secure-banking-auth.xyz/verify-account?token=89f92'),
      isEncrypted: true,
      intercepted: true
    },
    {
      id: 'MSG-003',
      sender: 'Elena Rostova (Compliance)',
      senderNumber: '+1 (555) 019-8821',
      timestamp: '12:02 PM',
      content: 'Confirmed. Official Chase personal portal is accessible at https://www.chase.com/personal/banking for treasury reconciliation.',
      hasLink: true,
      linkUrl: 'https://www.chase.com/personal/banking',
      scanResult: scanUrl('https://www.chase.com/personal/banking'),
      isEncrypted: true,
      intercepted: false
    }
  ]);

  const [testInput, setTestInput] = useState('');
  const [testSender, setTestSender] = useState('External Contact (+44 7911 123456)');

  const handleSendMessage = () => {
    if (!testInput.trim()) return;

    // Detect if message has link
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = testInput.match(urlRegex);
    const hasLink = Boolean(matches && matches.length > 0);
    const linkUrl = matches ? matches[0] : undefined;

    let scanResult: PhishingScanResult | undefined = undefined;
    let intercepted = false;

    if (linkUrl) {
      scanResult = scanUrl(linkUrl);
      if (scanResult.isThreat) {
        intercepted = true;
        onThreatIntercepted(scanResult);
        setSession(prev => ({
          ...prev,
          interceptedThreatsCount: prev.interceptedThreatsCount + 1,
          status: 'link_threat_intercepted'
        }));
      }
    }

    const newMsg: WhatsAppMessage = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      sender: testSender,
      senderNumber: '+44 7911 123456',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: testInput,
      hasLink,
      linkUrl,
      scanResult,
      isEncrypted: true,
      intercepted
    };

    setChatMessages(prev => [...prev, newMsg]);
    setTestInput('');
  };

  const handleRotateKeys = () => {
    setSession(prev => ({
      ...prev,
      ratchetStep: prev.ratchetStep + 1,
      status: 'connected_encrypted'
    }));
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2.5">
            <Lock className="w-6 h-6 text-emerald-400" />
            <span>WhatsApp Web End-to-End Encryption & Link Shield</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Maintains continuous Signal Protocol Double-Ratchet encryption and neutralizes unknown third-party links targeting financial accounts before delivery.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRotateKeys}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs text-slate-300 font-mono transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rotate Ratchet Step ({session.ratchetStep})</span>
          </button>
        </div>
      </div>

      {/* Cryptographic Protocol & Session Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
          <span className="text-xs text-slate-400">E2EE Protocol</span>
          <div className="text-sm font-semibold font-mono text-emerald-400">
            {session.e2eeProtocol}
          </div>
          <span className="text-[11px] text-slate-400">Curve25519 ECDH</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
          <span className="text-xs text-slate-400">Cipher Suite</span>
          <div className="text-sm font-semibold font-mono text-white">
            {session.cipherSuite}
          </div>
          <span className="text-[11px] text-slate-400">GCM Authenticated Encryption</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
          <span className="text-xs text-slate-400">Forward Secrecy</span>
          <div className="text-sm font-semibold font-mono text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>ACTIVE (Ratchet #{session.ratchetStep})</span>
          </div>
          <span className="text-[11px] text-slate-400">Ephemeral key ratcheting</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
          <span className="text-xs text-slate-400">Threats Intercepted in Chat</span>
          <div className="text-sm font-semibold font-mono text-rose-400">
            {session.interceptedThreatsCount} Phishing Links
          </div>
          <span className="text-[11px] text-slate-400">Neutralized before click</span>
        </div>
      </div>

      {/* Two Column Layout: Live Chat Simulator with In-Chat Phishing Interceptor & QR Verification Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Simulator */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-950 flex flex-col h-[520px] overflow-hidden">
          {/* Chat Header */}
          <div className="px-5 py-3.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                WA
              </div>
              <div>
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <span>WhatsApp Web Financial Gateway</span>
                  <Lock className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  End-to-end encrypted · Signal Protocol v3
                </div>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Session: {session.sessionId}</span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/90">
            {chatMessages.map((msg) => {
              const isIntercepted = msg.intercepted;
              return (
                <div 
                  key={msg.id}
                  className={`max-w-lg p-3.5 rounded-xl border space-y-2 ${
                    isIntercepted
                      ? 'border-rose-500/40 bg-rose-950/20 mr-auto'
                      : 'border-slate-800 bg-slate-900/90 ml-auto'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800/60">
                    <span className="font-semibold text-slate-300">{msg.sender}</span>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    {msg.content}
                  </p>

                  {/* Intercepted Warning Box if Malicious Link */}
                  {isIntercepted && msg.scanResult && (
                    <div className="p-2.5 rounded bg-rose-900/30 border border-rose-500/30 text-rose-200 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-rose-300">
                        <Ban className="w-4 h-4 text-rose-400" />
                        <span>MALICIOUS PHISHING LINK NEUTRALIZED</span>
                      </div>
                      <div className="text-[11px] text-rose-200/90">
                        AegisShield Link Guardian prevented execution of this URL to protect your banking session:
                      </div>
                      <div className="font-mono text-[10px] bg-slate-950/80 p-1.5 rounded text-rose-400 break-all">
                        {msg.scanResult.url}
                      </div>
                      <div className="text-[10px] font-mono text-rose-300/80">
                        Reason: {msg.scanResult.matchedRules[0] || 'Domain impersonation heuristic'}
                      </div>
                    </div>
                  )}

                  {/* Clean link preview */}
                  {!isIntercepted && msg.hasLink && msg.scanResult && (
                    <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-mono text-[11px] truncate max-w-xs">{msg.linkUrl}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 shrink-0">Safe Link</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Test Chat Input */}
          <div className="p-3 bg-slate-900/80 border-t border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Simulate inbound message or test link (e.g. try pasting phishing link)..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!testInput.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Inject Message</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Try test: "https://whatsapp-secure-banking-auth.xyz"</span>
              <button
                onClick={() => setTestInput('Notice: please verify your credentials at https://whatsapp-secure-banking-auth.xyz/verify-account')}
                className="text-emerald-400 hover:underline"
              >
                Paste Malicious Link Test
              </button>
            </div>
          </div>
        </div>

        {/* QR Code & Pairing Security Details */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Cryptographic QR Pairing</span>
              </h3>
              <span className="text-xs text-emerald-400 font-mono">Authenticated</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Paired Device:</span>
                <span className="font-mono text-white">{session.deviceName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Enclave OS:</span>
                <span className="font-mono text-white">{session.os}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Session IP:</span>
                <span className="font-mono text-white">{session.ipAddress}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Pairing Handshake:</span>
                <span className="font-mono text-emerald-400">Noise-XX Framework</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1.5">
              <div className="font-semibold text-slate-200">GhostPair Hijacking Defense:</div>
              <p>
                AegisShield verifies asymmetric challenge signatures during QR sync, rejecting spoofed web socket connections or unauthorized browser extensions.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Financial Regulatory Alignment
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>GDPR Art. 32: End-to-end payload encryption prevents intermediary surveillance.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>GLBA Safeguards Rule: Customer NPI is never logged in unencrypted plaintext.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
