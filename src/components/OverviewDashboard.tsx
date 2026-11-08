import React from 'react';
import { 
  ShieldAlert, 
  Fingerprint, 
  Lock, 
  Trash2, 
  Activity, 
  Globe, 
  AlertTriangle, 
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Server
} from 'lucide-react';
import { SYSTEM_REGIONS } from '../services/threatStream';
import { SecurityAlert, ComplianceAuditLog } from '../types/security';

interface OverviewDashboardProps {
  onNavigate: (tab: string) => void;
  alerts: SecurityAlert[];
  recentLogs: ComplianceAuditLog[];
  blockedCount: number;
  biometricCount: number;
  zeroizedCount: number;
  isOffline: boolean;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onNavigate,
  alerts,
  recentLogs,
  blockedCount,
  biometricCount,
  zeroizedCount,
  isOffline
}) => {
  const criticalAlert = alerts.find(a => a.severity === 'critical' && !a.acknowledged);

  return (
    <div className="space-y-8">
      {/* Offline Status Notice if active */}
      {isOffline && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
            <div className="text-sm">
              <span className="font-semibold">Local Offline Cache Active:</span> Telemetry and policy definitions are operating from local browser persistence. Automatic sync will resume once reconnected.
            </div>
          </div>
          <span className="text-xs uppercase font-mono tracking-wider text-amber-400/80">Local Storage Sync</span>
        </div>
      )}

      {/* Urgent Incident Alert Strip if critical threat active */}
      {criticalAlert && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-rose-300 flex items-center gap-2">
                <span>Critical Threat Alert</span>
                <span className="text-xs text-rose-400/80 font-mono">[{criticalAlert.id}]</span>
              </div>
              <p className="text-xs text-rose-200/90 mt-0.5">{criticalAlert.description}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('phishing')}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5"
          >
            Inspect Defense <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Phishing Threats Blocked */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 dark:bg-slate-900/60 light:bg-white light:border-slate-200">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Phishing Links Blocked</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white dark:text-white light:text-slate-900">
              {blockedCount.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 font-mono">100% intercepted</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">WhatsApp & bank spoof filters active</p>
        </div>

        {/* Biometric MFA Transactions */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 dark:bg-slate-900/60 light:bg-white light:border-slate-200">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Biometric MFA Verified</span>
            <Fingerprint className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white dark:text-white light:text-slate-900">
              {biometricCount.toLocaleString()}
            </span>
            <span className="text-xs text-indigo-400 font-mono">FIDO2 / TouchID</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Mandatory for all financial transfers</p>
        </div>

        {/* WhatsApp E2EE Sessions */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 dark:bg-slate-900/60 light:bg-white light:border-slate-200">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>WhatsApp E2EE Ratchets</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white dark:text-white light:text-slate-900">
              2,840
            </span>
            <span className="text-xs text-emerald-400 font-mono">Curve25519</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Double-Ratchet forward secrecy</p>
        </div>

        {/* Customer PII Ephemeral Zeroized */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 dark:bg-slate-900/60 light:bg-white light:border-slate-200">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Customer Data Zeroized</span>
            <Trash2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white dark:text-white light:text-slate-900">
              {zeroizedCount.toLocaleString()}
            </span>
            <span className="text-xs text-amber-400 font-mono">GDPR Art. 17</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Immediate post-purchase shredding</p>
        </div>
      </div>

      {/* Interactive Workflow Quick Launch Section */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-50 light:border-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-base font-semibold text-white dark:text-white light:text-slate-900">
              Live Enterprise Defense Modules
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Interact with real-time defensive controls to simulate attacks, verify biometrics, and test GDPR data erasure.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Real-time Sentinel Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('phishing')}
            className="p-4 rounded-lg border border-slate-800 hover:border-indigo-500/50 bg-slate-950/60 hover:bg-slate-800/60 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                Phishing Filter Engine
              </span>
              <ShieldAlert className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
            </div>
            <p className="text-xs text-slate-400 line-clamp-2">
              Scan links for domain entropy, homoglyphs, and WhatsApp banking impersonation attacks.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
              <span>Launch Link Guardian</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('banking_mfa')}
            className="p-4 rounded-lg border border-slate-800 hover:border-emerald-500/50 bg-slate-950/60 hover:bg-slate-800/60 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                Biometric Banking MFA
              </span>
              <Fingerprint className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
            </div>
            <p className="text-xs text-slate-400 line-clamp-2">
              Trigger TouchID/FaceID for transactions with automated lockout on unidentified activity.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <span>Execute Transfer Verification</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('compliance')}
            className="p-4 rounded-lg border border-slate-800 hover:border-amber-500/50 bg-slate-950/60 hover:bg-slate-800/60 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                GDPR Post-Purchase Zeroizer
              </span>
              <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
            </div>
            <p className="text-xs text-slate-400 line-clamp-2">
              Shred customer credit cards and PII immediately upon purchase settlement with cryptographic proofs.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
              <span>Audit Data Zeroization</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </div>
      </div>

      {/* Two-Column Layout: Real-Time Audit Stream & Cloud Multi-Region Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Security Events */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Real-Time Audit & Security Event Stream</span>
            </h3>
            <button
              onClick={() => onNavigate('compliance')}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              <span>View Full Ledger</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-900/60 dark:bg-slate-900/60 light:bg-white light:border-slate-200 overflow-hidden">
            {recentLogs.slice(0, 5).map((log) => {
              const isCrit = log.severity === 'critical';
              const isHigh = log.severity === 'high';
              return (
                <div key={log.id} className="p-4 hover:bg-slate-800/30 transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`font-medium ${
                        isCrit ? 'text-rose-400' : isHigh ? 'text-amber-400' : 'text-slate-300'
                      }`}>
                        {log.event}
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-400 font-mono">{log.regulationTag}</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{log.details}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>{log.timestamp}</span>
                      <span>IP: {log.ipAddress}</span>
                      <span className="text-slate-400">Hash: {log.integrityHash.substring(0, 10)}...</span>
                    </div>
                  </div>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                    isCrit 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                      : isHigh 
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}>
                    {log.severity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Cloud-Native High-Availability Multi-Region Nodes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Multi-Region Cloud Nodes</span>
            </h3>
            <span className="text-xs text-emerald-400 font-mono">3/3 Sync</span>
          </div>

          <div className="space-y-3">
            {SYSTEM_REGIONS.map((reg) => (
              <div 
                key={reg.region}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 dark:bg-slate-900/60 light:bg-white light:border-slate-200"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="font-semibold text-white dark:text-white light:text-slate-900 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-slate-400" />
                    <span>{reg.location}</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">
                    {reg.latencyMs}ms latency
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                  <span>{reg.region}</span>
                  <span>{reg.throughput}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400/90 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> E2EE Replicated
                  </span>
                  <span className="font-mono text-slate-400">AES-256-GCM</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-xs text-slate-400 space-y-2">
            <div className="font-medium text-slate-300">Regulatory Adherence Standards:</div>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="text-slate-400">GDPR Art. 17 & 32</span>
              <span>·</span>
              <span className="text-slate-400">CCPA § 1798.105</span>
              <span>·</span>
              <span className="text-slate-400">PCI-DSS v4.0</span>
              <span>·</span>
              <span className="text-slate-400">GLBA Safeguards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
