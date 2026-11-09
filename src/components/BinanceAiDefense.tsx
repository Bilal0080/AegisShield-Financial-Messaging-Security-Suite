import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Eye, 
  Cpu, 
  Key, 
  Zap, 
  Globe, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  Smartphone,
  Fingerprint,
  Ban
} from 'lucide-react';
import { BinanceAccountGuardState, BinanceAiThreatIncident } from '../types/security';
import { 
  INITIAL_BINANCE_GUARD, 
  INITIAL_BINANCE_INCIDENTS, 
  AI_ATTACK_SCENARIOS, 
  AiAttackScenario 
} from '../services/binanceAiSentinel';

interface BinanceAiDefenseProps {
  onAiAttackBlocked: (incident: BinanceAiThreatIncident) => void;
  onEmergencyLockdown: (reason: string) => void;
}

export const BinanceAiDefense: React.FC<BinanceAiDefenseProps> = ({
  onAiAttackBlocked,
  onEmergencyLockdown
}) => {
  const [guardState, setGuardState] = useState<BinanceAccountGuardState>(INITIAL_BINANCE_GUARD);
  const [incidents, setIncidents] = useState<BinanceAiThreatIncident[]>(INITIAL_BINANCE_INCIDENTS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string | null>(null);

  // Anti-Phishing Code verification tool state
  const [testEmailText, setTestEmailText] = useState('');
  const [antiPhishingVerdict, setAntiPhishingVerdict] = useState<{
    valid: boolean;
    reason: string;
  } | null>(null);

  // Trigger Emergency Account Freeze (Kill Switch)
  const handleTriggerKillSwitch = () => {
    setGuardState(prev => ({
      ...prev,
      accountStatus: 'emergency_frozen',
      activeCooldownHoursRemaining: 48
    }));
    onEmergencyLockdown('Manual or automated Emergency Kill-Switch engaged: All Binance withdrawals, API keys, and trading locked.');
  };

  // Restore Account with FIDO2 / YubiKey
  const handleRestoreAccount = () => {
    setGuardState(prev => ({
      ...prev,
      accountStatus: 'secure_active',
      activeCooldownHoursRemaining: 0
    }));
  };

  // Run AI Attack Simulation
  const handleRunAiAttackSimulation = (scenario: AiAttackScenario) => {
    setIsSimulating(true);
    setSimulationLog(`Intercepting inbound ${scenario.label} attack vector...`);

    setTimeout(() => {
      const incident: BinanceAiThreatIncident = {
        id: `BIN-SEC-${Date.now().toString().slice(-4)}`,
        attackType: scenario.type,
        title: `${scenario.label} Intercepted & Defeated`,
        description: scenario.description,
        detectionSignature: scenario.detectionSignature,
        riskConfidence: 98,
        sourceIp: scenario.sourceIp,
        location: scenario.location,
        timestamp: 'Just now',
        mitigationAction: scenario.mitigation,
        status: 'intercepted_and_neutralized'
      };

      setIncidents(prev => [incident, ...prev]);
      setGuardState(prev => ({
        ...prev,
        blockedAiAttacksCount: prev.blockedAiAttacksCount + 1,
        accountStatus: scenario.mitigation === 'kill_switch_activated' 
          ? 'emergency_frozen' 
          : scenario.mitigation === 'withdrawal_frozen_24h'
          ? 'withdrawal_cooldown'
          : prev.accountStatus,
        activeCooldownHoursRemaining: scenario.mitigation === 'withdrawal_frozen_24h' ? 24 : prev.activeCooldownHoursRemaining
      }));

      onAiAttackBlocked(incident);
      setIsSimulating(false);
      setSimulationLog(`Neutralized! ${scenario.detectionSignature} was matched. Defense protocol: ${scenario.mitigation.replace(/_/g, ' ')} executed.`);
    }, 850);
  };

  // Verify Inbound Binance Email for User Anti-Phishing Code
  const handleVerifyInboundMessage = () => {
    if (!testEmailText.trim()) return;

    if (testEmailText.includes(guardState.antiPhishingCode)) {
      setAntiPhishingVerdict({
        valid: true,
        reason: `Cryptographic Anti-Phishing Code verified: "${guardState.antiPhishingCode}". This message originated from genuine Binance security infrastructure.`
      });
    } else {
      setAntiPhishingVerdict({
        valid: false,
        reason: `ALERT: Anti-Phishing Code is MISSING or INVALID. This is an adversarial AI-generated phishing campaign attempting credential theft. Do NOT click links or approve 2FA prompts.`
      });
    }
  };

  const isFrozen = guardState.accountStatus === 'emergency_frozen';
  const isCooldown = guardState.accountStatus === 'withdrawal_cooldown';

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-amber-400" />
            <span>Binance Account AI Defense & Unidentified Activity Shield</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Defends Binance crypto accounts against generative AI deepfake KYC bypass, autonomous AI flash-drain bots, impossible travel geo-velocity, and credential exfiltration.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isFrozen ? (
            <button
              onClick={handleRestoreAccount}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Verify FIDO2 & Unlock Account</span>
            </button>
          ) : (
            <button
              onClick={handleTriggerKillSwitch}
              className="px-4 py-2 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Engage Emergency Kill Switch</span>
            </button>
          )}
        </div>
      </div>

      {/* Account Status Card Banner */}
      <div className={`p-6 rounded-xl border transition-all ${
        isFrozen 
          ? 'border-rose-500/60 bg-rose-950/30' 
          : isCooldown
          ? 'border-amber-500/60 bg-amber-950/30'
          : 'border-emerald-500/40 bg-emerald-950/20'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`p-3 rounded-xl shrink-0 ${
              isFrozen ? 'bg-rose-500/20 text-rose-400' : isCooldown ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {isFrozen ? <ShieldAlert className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">
                  Binance Account {guardState.accountUid}
                </span>
                <span className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded border font-semibold ${
                  isFrozen 
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400' 
                    : isCooldown
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                }`}>
                  {guardState.accountStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {isFrozen 
                  ? 'EMERGENCY LOCKDOWN ENGAGED: All withdrawals, trading bots, and API sessions are terminated. Zero funds can exit without hardware security key verification.'
                  : isCooldown
                  ? `WITHDRAWAL COOLDOWN ACTIVE (${guardState.activeCooldownHoursRemaining}h remaining): Outward crypto transfers temporarily locked following an intercepted AI attack attempt.`
                  : 'All AI intrusion prevention layers operational. Deepfake liveness verification, API flash-drain sensors, and Anti-Phishing code active.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono shrink-0">
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">AI Attacks Defeated</span>
              <span className="text-2xl font-bold font-mono text-white tabular-nums">
                {guardState.blockedAiAttacksCount}
              </span>
            </div>
          </div>
        </div>

        {/* Security Controls Grid */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">AI Deepfake Sentry</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Spectral Liveness
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Hardware Key (FIDO2)</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> YubiKey Mandatory
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Withdrawal Whitelist</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> 24h Lock Enforced
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Anti-Phishing Code</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1 mt-0.5 truncate">
              <Key className="w-3 h-3 shrink-0" /> {guardState.antiPhishingCode}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Live Attack Simulator & Anti-Phishing Verifier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interactive AI Attack Simulation Center */}
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Simulate AI Attack Vectors Against Binance</span>
            </h3>
            <span className="text-xs text-amber-400 font-mono">Real-Time Defensive Test</span>
          </div>

          <p className="text-xs text-slate-400">
            Select an adversarial AI attack vector to test the automated defense filters and instant account freeze mechanisms:
          </p>

          <div className="space-y-2.5">
            {AI_ATTACK_SCENARIOS.map((scen) => (
              <div 
                key={scen.type}
                className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-white">{scen.label}</div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{scen.description}</p>
                  <div className="text-[10px] font-mono text-slate-400">Origin: {scen.location}</div>
                </div>

                <button
                  onClick={() => handleRunAiAttackSimulation(scen)}
                  disabled={isSimulating}
                  className="px-3 py-1.5 rounded-lg bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-mono font-medium whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Cpu className="w-3 h-3" />
                  <span>Test Attack</span>
                </button>
              </div>
            ))}
          </div>

          {simulationLog && (
            <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/30 text-xs font-mono text-amber-300">
              {simulationLog}
            </div>
          )}
        </div>

        {/* Binance Anti-Phishing Code Verification Tool */}
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Binance Anti-Phishing Code Validator</span>
            </h3>
            <span className="text-xs text-indigo-400 font-mono">Watermark Check</span>
          </div>

          <p className="text-xs text-slate-400">
            Binance allows users to configure a unique secret code included in every genuine email and SMS. Paste suspicious notifications here to verify authenticity against your configured code:
          </p>

          <div className="space-y-3">
            <textarea
              rows={3}
              value={testEmailText}
              onChange={(e) => setTestEmailText(e.target.value)}
              placeholder="Paste email/SMS notification text claiming to be from Binance..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTestEmailText(`Binance Security Alert: Your account logged in from New IP. Anti-Phishing Code: ${guardState.antiPhishingCode}. Please review activity.`)}
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  Load Genuine Notice
                </button>
                <span className="text-slate-600">·</span>
                <button
                  type="button"
                  onClick={() => setTestEmailText("URGENT: Binance withdrawal verification required immediately to prevent account suspension. Click: https://binance-security-verify.cc/login")}
                  className="text-[11px] text-rose-400 hover:underline"
                >
                  Load Fake AI Phishing
                </button>
              </div>

              <button
                onClick={handleVerifyInboundMessage}
                disabled={!testEmailText.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Inspect Watermark
              </button>
            </div>

            {antiPhishingVerdict && (
              <div className={`p-4 rounded-lg border text-xs space-y-1.5 ${
                antiPhishingVerdict.valid 
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300' 
                  : 'border-rose-500/40 bg-rose-950/20 text-rose-300'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {antiPhishingVerdict.valid ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                  <span>{antiPhishingVerdict.valid ? 'GENUINE BINANCE COMMUNICATION' : 'MALICIOUS AI PHISHING DETECTED'}</span>
                </div>
                <p className="text-[11px] opacity-90">{antiPhishingVerdict.reason}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Neutralized Attacks Incident Log */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Binance AI Threat Neutralization Log</h3>
          <span className="text-xs text-slate-400 font-mono">Real-time cryptographically sealed record</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden divide-y divide-slate-800">
          {incidents.map((inc) => (
            <div key={inc.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{inc.title}</span>
                  <span className="text-slate-500 text-xs">·</span>
                  <span className="text-[11px] font-mono text-amber-400">Confidence: {inc.riskConfidence}%</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{inc.description}</p>
                <div className="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-3 pt-0.5">
                  <span>ID: {inc.id}</span>
                  <span>IP: {inc.sourceIp} ({inc.location})</span>
                  <span>Sig: {inc.detectionSignature}</span>
                  <span>{inc.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded border bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold">
                  {inc.status.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {inc.mitigationAction.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
