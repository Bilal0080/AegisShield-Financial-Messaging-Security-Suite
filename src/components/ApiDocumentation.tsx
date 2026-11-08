import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Play, 
  CheckCircle2, 
  Globe, 
  Lock, 
  Code2, 
  Server,
  Layers
} from 'lucide-react';

interface ApiEndpoint {
  method: 'POST' | 'GET';
  path: string;
  title: string;
  description: string;
  sampleRequest: Record<string, any>;
  sampleResponse: Record<string, any>;
}

export const ApiDocumentation: React.FC = () => {
  const endpoints: ApiEndpoint[] = [
    {
      method: 'POST',
      path: '/api/v1/phishing/scan',
      title: 'Heuristic Phishing & Domain Guardian Scanner',
      description: 'Inspects inbound URLs or messaging payloads against domain entropy, homoglyph punycode attacks, and banking impersonation databases.',
      sampleRequest: {
        url: 'https://whatsapp-secure-banking-auth.xyz/verify-account',
        origin: 'whatsapp_web_inbound',
        depth: 'full_heuristics'
      },
      sampleResponse: {
        domain: 'whatsapp-secure-banking-auth.xyz',
        isThreat: true,
        threatType: 'fake_whatsapp_portal',
        confidenceScore: 85,
        entropy: 3.91,
        reputation: 'malicious',
        actionTaken: 'blocked_and_quarantined',
        matchedRules: [
          'CRITICAL: Spoofing financial/messaging brand "WhatsApp"',
          'MEDIUM: High-abuse Top-Level Domain (.xyz)'
        ]
      }
    },
    {
      method: 'POST',
      path: '/api/v1/banking/biometric/challenge',
      title: 'Biometric Multi-Factor Authentication Challenge',
      description: 'Generates a FIDO2 WebAuthn cryptographic challenge for mandatory transaction authorization. Blocks access if verification fails.',
      sampleRequest: {
        transactionId: 'TX-891024',
        amount: 4500,
        currency: 'USD',
        recipientBank: 'JPMorgan Chase Bank',
        biometricMethod: 'touch_id'
      },
      sampleResponse: {
        challengeId: 'CHAL-891024',
        status: 'authenticated',
        deviceAttestation: 'FIDO2-L3-SecureEnclave',
        credentialId: 'fido2-cred-9f4a12c',
        attestationHash: '0x99ea147b2c5890eef2'
      }
    },
    {
      method: 'POST',
      path: '/api/v1/whatsapp/e2ee/verify',
      title: 'WhatsApp Web Signal Ratchet & GhostPair Verifier',
      description: 'Validates Curve25519 session keys, Double Ratchet step counts, and QR pairing authenticity.',
      sampleRequest: {
        sessionId: 'WA-SEC-2026-9921',
        ratchetStep: 149,
        publicKeyDigest: '0x77aa4411ee909022bb'
      },
      sampleResponse: {
        status: 'connected_encrypted',
        cipherSuite: 'AES-256-GCM_HMAC_SHA256',
        forwardSecrecy: true,
        ghostPairRisk: 'none'
      }
    },
    {
      method: 'POST',
      path: '/api/v1/compliance/zeroize',
      title: 'Post-Purchase Ephemeral Data Zeroization (GDPR & CCPA)',
      description: 'Immediately wipes credit card PAN, CVV, customer IP, and billing address upon payment settlement. Issues vaulted zero-knowledge tokens.',
      sampleRequest: {
        orderId: 'ORD-77491',
        customerName: 'Alexander Wright',
        creditCardNumber: '4532 •••• •••• 8819',
        cvv: '742',
        amount: 349.50
      },
      sampleResponse: {
        orderId: 'ORD-77491',
        sanitizedToken: 'TKN-VAULT-8B92-ZKP-2026',
        sha256Hash: '0x17c09d84ab61340177',
        zeroizeDurationMs: 38,
        gdprStatus: 'Art_17_Erasure_Certified',
        ccpaStatus: '1798_OptOut_Protected'
      }
    }
  ];

  const [activeEndpointIndex, setActiveEndpointIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [outputResponse, setOutputResponse] = useState<Record<string, any> | null>(null);
  const [copied, setCopied] = useState(false);

  const activeEndpoint = endpoints[activeEndpointIndex];

  const handleRunEndpoint = () => {
    setIsRunning(true);
    setTimeout(() => {
      setOutputResponse(activeEndpoint.sampleResponse);
      setIsRunning(false);
    }, 350);
  };

  const handleCopyCurl = () => {
    const curlCommand = `curl -X ${activeEndpoint.method} "https://api.aegisshield.enterprise${activeEndpoint.path}" \\
  -H "Authorization: Bearer aegis_live_sec_key_token" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(activeEndpoint.sampleRequest, null, 2)}'`;
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2.5">
            <Code2 className="w-6 h-6 text-indigo-400" />
            <span>Developer API Documentation & Interactive Sandbox</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Fully documented REST & WebSocket interfaces for enterprise integration, phishing automation, and GDPR compliance pipelines.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>v1.4 OpenAPI 3.1 Spec Active</span>
        </div>
      </div>

      {/* Main Endpoint Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Endpoint Selector Navigation */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Available Core Endpoints
          </h3>
          <div className="space-y-2">
            {endpoints.map((ep, idx) => (
              <button
                key={ep.path}
                onClick={() => {
                  setActiveEndpointIndex(idx);
                  setOutputResponse(null);
                }}
                className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                  activeEndpointIndex === idx
                    ? 'border-indigo-500 bg-slate-900 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-xs mb-1">
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    ep.method === 'POST' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="truncate text-white">{ep.path}</span>
                </div>
                <div className="text-xs font-medium text-slate-300 truncate">
                  {ep.title}
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-xs text-slate-400 space-y-1.5">
            <span className="font-semibold text-slate-200 block">Cloud-Native Regional Base URLs:</span>
            <div className="font-mono text-[11px] space-y-1 text-slate-400">
              <div>us-east-1: https://us.api.aegisshield.corp</div>
              <div>eu-west-1: https://eu.api.aegisshield.corp</div>
              <div>ap-se-1: https://ap.api.aegisshield.corp</div>
            </div>
          </div>
        </div>

        {/* Endpoint Details & Interactive Runner */}
        <div className="lg:col-span-2 space-y-5">
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold">
                    {activeEndpoint.method}
                  </span>
                  <span className="text-white font-semibold text-sm">{activeEndpoint.path}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{activeEndpoint.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCurl}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied' : 'cURL'}</span>
                </button>
                <button
                  onClick={handleRunEndpoint}
                  disabled={isRunning}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isRunning ? 'Executing...' : 'Run Request'}</span>
                </button>
              </div>
            </div>

            {/* Request Payload */}
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                JSON Request Body
              </span>
              <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto">
                {JSON.stringify(activeEndpoint.sampleRequest, null, 2)}
              </pre>
            </div>

            {/* Response Output */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Live Response Payload
                </span>
                {outputResponse && (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> HTTP 200 OK (38ms)
                  </span>
                )}
              </div>
              <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
                {outputResponse
                  ? JSON.stringify(outputResponse, null, 2)
                  : JSON.stringify(activeEndpoint.sampleResponse, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
