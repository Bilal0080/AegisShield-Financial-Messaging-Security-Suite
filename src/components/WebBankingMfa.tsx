import React, { useState } from 'react';
import { 
  Fingerprint, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  Smartphone,
  Eye,
  KeyRound,
  Shield
} from 'lucide-react';
import { BankingTransaction, BiometricChallenge, ComplianceAuditLog } from '../types/security';
import { evaluateTransactionRisk, executeBiometricChallenge } from '../services/biometricAuth';

interface WebBankingMfaProps {
  onTransactionSuccess: (tx: BankingTransaction) => void;
  onLockoutTriggered: (tx: BankingTransaction, reason: string) => void;
}

export const WebBankingMfa: React.FC<WebBankingMfaProps> = ({
  onTransactionSuccess,
  onLockoutTriggered
}) => {
  // Transfer Form State
  const [recipient, setRecipient] = useState('Apex Technologies Treasury');
  const [recipientBank, setRecipientBank] = useState('JPMorgan Chase Bank (US)');
  const [amount, setAmount] = useState<number>(4500);
  const [txType, setTxType] = useState<BankingTransaction['type']>('wire_transfer');
  
  // Account Status State
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [accountLockReason, setAccountLockReason] = useState<string | null>(null);

  // Biometric Modal State
  const [activeChallenge, setActiveChallenge] = useState<BiometricChallenge | null>(null);
  const [biometricMethod, setBiometricMethod] = useState<'touch_id' | 'face_id' | 'fido2_key'>('touch_id');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Transaction Ledger State
  const [transactions, setTransactions] = useState<BankingTransaction[]>([
    {
      id: 'TX-891024',
      userId: 'USR-3401 (Primary Web Banking)',
      userName: 'Elena Rostova',
      amount: 4500,
      currency: 'USD',
      recipient: 'Apex Technologies Treasury',
      recipientBank: 'JPMorgan Chase Bank',
      type: 'wire_transfer',
      status: 'completed',
      biometricVerified: true,
      riskLevel: 'low',
      timestamp: '2026-11-08 11:42:18',
      zeroized: false
    },
    {
      id: 'TX-891023',
      userId: 'USR-3401 (Primary Web Banking)',
      userName: 'Elena Rostova',
      amount: 14200,
      currency: 'USD',
      recipient: 'Global Cloud Systems Ltd',
      recipientBank: 'Barclays International',
      type: 'international_ach',
      status: 'completed',
      biometricVerified: true,
      riskLevel: 'medium',
      timestamp: '2026-11-08 08:15:30',
      zeroized: false
    }
  ]);

  const riskEvaluation = evaluateTransactionRisk({
    amount,
    type: txType,
    recipient
  });

  const handleInitiateTransfer = () => {
    if (isAccountLocked) return;
    setVerificationError(null);

    const challenge: BiometricChallenge = {
      id: `CHAL-${Date.now().toString().slice(-6)}`,
      transactionId: `TX-${Date.now().toString().slice(-6)}`,
      accountNumber: '•••• •••• •••• 4920',
      amount,
      currency: 'USD',
      recipient,
      recipientBank,
      riskScore: riskEvaluation.riskScore,
      riskFactors: riskEvaluation.factors,
      biometricMethod,
      status: 'pending',
      deviceAttestation: 'FIDO2-L3-SecureEnclave',
      timestamp: new Date().toISOString()
    };

    setActiveChallenge(challenge);
  };

  const handleExecuteBiometric = async (forceMismatch = false) => {
    if (!activeChallenge) return;
    setIsVerifying(true);
    setVerificationError(null);

    try {
      const result = await executeBiometricChallenge(activeChallenge, forceMismatch);
      setIsVerifying(false);

      if (result.success) {
        // Successful verification
        const newTx: BankingTransaction = {
          id: activeChallenge.transactionId,
          userId: 'USR-3401 (Primary Web Banking)',
          userName: 'Elena Rostova',
          amount: activeChallenge.amount,
          currency: activeChallenge.currency,
          recipient: activeChallenge.recipient,
          recipientBank: activeChallenge.recipientBank,
          type: txType,
          status: 'completed',
          biometricVerified: true,
          riskLevel: riskEvaluation.riskLevel,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          zeroized: false
        };

        setTransactions(prev => [newTx, ...prev]);
        onTransactionSuccess(newTx);
        setActiveChallenge(null);
      } else {
        // Failed / Unidentified biometric mismatch
        setVerificationError(result.reason || 'Biometric authentication failed.');
        setIsAccountLocked(true);
        setAccountLockReason(result.reason || 'Unidentified biometric scan detected. Automatic account lockdown triggered.');

        const blockedTx: BankingTransaction = {
          id: activeChallenge.transactionId,
          userId: 'USR-3401 (Primary Web Banking)',
          userName: 'Elena Rostova',
          amount: activeChallenge.amount,
          currency: activeChallenge.currency,
          recipient: activeChallenge.recipient,
          recipientBank: activeChallenge.recipientBank,
          type: txType,
          status: 'blocked_unverified',
          biometricVerified: false,
          riskLevel: 'critical',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          zeroized: false
        };

        setTransactions(prev => [blockedTx, ...prev]);
        onLockoutTriggered(blockedTx, result.reason || 'Unidentified user activity during biometric challenge');
      }
    } catch {
      setIsVerifying(false);
      setVerificationError('Hardware authenticator communication timed out.');
    }
  };

  const handleUnlockAccount = () => {
    setIsAccountLocked(false);
    setAccountLockReason(null);
    setActiveChallenge(null);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2.5">
            <Fingerprint className="w-6 h-6 text-indigo-400" />
            <span>Web Banking Biometric Multi-Factor Authentication</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Enforces hardware-grade biometric authentication (FIDO2 / TouchID / FaceID) for 100% of financial transfers with instant lockout on unidentified activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded text-xs font-mono border ${
            isAccountLocked 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 font-semibold' 
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            {isAccountLocked ? 'ACCOUNT QUARANTINED' : 'ACCOUNT STATUS: PROTECTED'}
          </span>
        </div>
      </div>

      {/* Account Lockout Banner if locked */}
      {isAccountLocked && (
        <div className="p-5 rounded-xl border border-rose-500/50 bg-rose-950/30 text-rose-200 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-rose-300">
                  Account Locked: Unidentified Biometric Activity
                </h3>
                <p className="text-xs text-rose-200/90 mt-1">
                  {accountLockReason || 'Biometric authentication failed. Financial operations have been halted immediately to prevent unauthorized fund exfiltration.'}
                </p>
              </div>
            </div>
            <button
              onClick={handleUnlockAccount}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Admin Override / Unlock</span>
            </button>
          </div>
          <div className="text-[11px] font-mono text-rose-300/80 pt-2 border-t border-rose-500/20">
            Automated SOC Alert ALT-9820 dispatched · Session tokens revoked · Compliance incident recorded
          </div>
        </div>
      )}

      {/* Transfer Initiation & Live Risk Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transfer Form */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-slate-800 bg-slate-900/60 dark:bg-slate-900/60 light:bg-white light:border-slate-200 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-400" />
              <span>Initiate Web Banking Financial Transfer</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Account #•••• 4920</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Recipient / Payee Entity
              </label>
              <input
                type="text"
                value={recipient}
                disabled={isAccountLocked}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Destination Financial Institution
              </label>
              <input
                type="text"
                value={recipientBank}
                disabled={isAccountLocked}
                onChange={(e) => setRecipientBank(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                <input
                  type="number"
                  value={amount}
                  disabled={isAccountLocked}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3.5 py-2 text-sm text-slate-200 font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Transfer Channel / Category
              </label>
              <select
                value={txType}
                disabled={isAccountLocked}
                onChange={(e) => setTxType(e.target.value as BankingTransaction['type'])}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <option value="wire_transfer">Real-Time Wire Transfer</option>
                <option value="instant_p2p">Instant Verified P2P</option>
                <option value="international_ach">Cross-Border International ACH</option>
              </select>
            </div>
          </div>

          {/* Biometric Modality Picker */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Select Primary Biometric Authenticator
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setBiometricMethod('touch_id')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  biometricMethod === 'touch_id'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Fingerprint className="w-5 h-5 mb-1.5 text-indigo-400" />
                <div className="text-xs font-semibold">Touch ID</div>
                <div className="text-[10px] text-slate-400">Fingerprint Sensor</div>
              </button>

              <button
                type="button"
                onClick={() => setBiometricMethod('face_id')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  biometricMethod === 'face_id'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-5 h-5 mb-1.5 text-indigo-400" />
                <div className="text-xs font-semibold">Face ID</div>
                <div className="text-[10px] text-slate-400">3D Depth Geometry</div>
              </button>

              <button
                type="button"
                onClick={() => setBiometricMethod('fido2_key')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  biometricMethod === 'fido2_key'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                <KeyRound className="w-5 h-5 mb-1.5 text-indigo-400" />
                <div className="text-xs font-semibold">FIDO2 / Key</div>
                <div className="text-[10px] text-slate-400">Hardware Token</div>
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              * Biometric confirmation is mandatory for all outward transactions per banking regulations.
            </span>
            <button
              onClick={handleInitiateTransfer}
              disabled={isAccountLocked || amount <= 0}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <Fingerprint className="w-4 h-4" />
              <span>Prompt Biometric MFA (${amount.toLocaleString()})</span>
            </button>
          </div>
        </div>

        {/* Real-Time Risk Profiler Card */}
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>Transaction Risk Profiler</span>
            </h3>
            <span className={`text-xs font-mono font-bold uppercase ${
              riskEvaluation.riskLevel === 'critical' ? 'text-rose-400' : riskEvaluation.riskLevel === 'medium' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {riskEvaluation.riskLevel} Risk
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Risk Score Index</span>
              <span className="font-mono font-bold text-white">{riskEvaluation.riskScore}/100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  riskEvaluation.riskScore >= 60 ? 'bg-rose-500' : riskEvaluation.riskScore >= 35 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${riskEvaluation.riskScore}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-300 font-medium block">Evaluated Risk Factors:</span>
            {riskEvaluation.factors.length > 0 ? (
              riskEvaluation.factors.map((f, i) => (
                <div key={i} className="text-xs font-mono text-amber-300/90 flex items-center gap-1.5">
                  <span>·</span>
                  <span>{f}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Standard volume, verified domestic beneficiary</span>
              </div>
            )}
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="font-semibold text-slate-200">Security Invariant:</div>
            <div>Any biometric mismatch or unconfirmed identity will result in immediate session freeze.</div>
          </div>
        </div>
      </div>

      {/* Biometric Verification Modal */}
      {activeChallenge && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-indigo-500/40 bg-slate-950 p-6 space-y-6 shadow-2xl relative">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider">
                Hardware Biometric Verification
              </span>
              <h3 className="text-lg font-bold text-white">Confirm Financial Transaction</h3>
              <p className="text-xs text-slate-400 font-mono">
                {activeChallenge.accountNumber} · ${activeChallenge.amount.toLocaleString()} USD
              </p>
            </div>

            {/* Simulated Biometric Sensor Viewport */}
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="relative group cursor-pointer" onClick={() => !isVerifying && handleExecuteBiometric(false)}>
                {/* Visual Scanner Ring */}
                <div className={`w-28 h-28 rounded-full border-2 flex items-center justify-center transition-all ${
                  isVerifying 
                    ? 'border-indigo-400 animate-pulse bg-indigo-500/20' 
                    : 'border-indigo-500/40 hover:border-indigo-400 bg-indigo-950/30'
                }`}>
                  {biometricMethod === 'face_id' ? (
                    <Eye className={`w-12 h-12 ${isVerifying ? 'text-indigo-300' : 'text-indigo-400'}`} />
                  ) : (
                    <Fingerprint className={`w-12 h-12 ${isVerifying ? 'text-indigo-300' : 'text-indigo-400'}`} />
                  )}
                </div>

                {isVerifying && (
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-25" />
                )}
              </div>

              <div className="mt-4 text-center">
                <span className="text-xs font-semibold text-white block">
                  {isVerifying 
                    ? 'Verifying cryptographic biometric attestation...' 
                    : `Scan ${biometricMethod === 'face_id' ? 'Face ID' : 'Touch ID'} on sensor`}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Click the sensor icon to approve with authorized biometric
                </span>
              </div>
            </div>

            {/* Error display if mismatch */}
            {verificationError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{verificationError}</span>
              </div>
            )}

            {/* Buttons & Unidentified Activity Simulator */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={() => handleExecuteBiometric(false)}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>Verify Biometrics</span>
                </button>

                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={() => setActiveChallenge(null)}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>

              {/* Negative testing simulation button */}
              <button
                type="button"
                disabled={isVerifying}
                onClick={() => handleExecuteBiometric(true)}
                className="w-full py-2 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 rounded-lg text-xs font-mono transition-colors flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Simulate Unidentified Biometric Mismatch (Test Auto-Lockout)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Ledger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Recent Financial Transactions & Biometric Audit</h3>
          <span className="text-xs text-slate-400">Tamper-evident transaction stream</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden divide-y divide-slate-800">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    ${tx.amount.toLocaleString()} {tx.currency}
                  </span>
                  <span className="text-slate-500 text-xs">·</span>
                  <span className="text-xs text-slate-300 font-medium">{tx.recipient}</span>
                  <span className="text-slate-500 text-xs">·</span>
                  <span className="text-xs text-slate-400 font-mono">{tx.recipientBank}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-3">
                  <span>{tx.id}</span>
                  <span>{tx.timestamp}</span>
                  <span className="capitalize">{tx.type.replace(/_/g, ' ')}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  {tx.biometricVerified ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Biometric Verified
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> Blocked / Quarantined
                    </span>
                  )}
                </div>

                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                  tx.status === 'completed' 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}>
                  {tx.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
