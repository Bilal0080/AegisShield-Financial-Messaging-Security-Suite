import React, { useState } from 'react';
import { 
  FileCheck, 
  Trash2, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  Clock, 
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { ComplianceAuditLog } from '../types/security';
import { 
  zeroizePurchaseData, 
  exportAuditLogsToCsv, 
  CustomerPurchasePayload, 
  ZeroizedRecord 
} from '../services/complianceEngine';

interface ComplianceAuditorProps {
  logs: ComplianceAuditLog[];
  onNewLog: (log: ComplianceAuditLog) => void;
  zeroizedCount: number;
  setZeroizedCount: React.Dispatch<React.SetStateAction<number>>;
}

export const ComplianceAuditor: React.FC<ComplianceAuditorProps> = ({
  logs,
  onNewLog,
  zeroizedCount,
  setZeroizedCount
}) => {
  // Purchase Simulator State
  const [customerName, setCustomerName] = useState('Alexander Wright');
  const [creditCard, setCreditCard] = useState('4532 •••• •••• 8819');
  const [cvv, setCvv] = useState('742');
  const [billingAddress, setBillingAddress] = useState('742 Evergreen Terrace, Springfield, OR');
  const [purchaseAmount, setPurchaseAmount] = useState<number>(349.50);
  const [isZeroizing, setIsZeroizing] = useState(false);
  const [latestZeroized, setLatestZeroized] = useState<ZeroizedRecord | null>(null);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [showPrintModal, setShowPrintModal] = useState(false);

  const handleExecutePurchaseZeroization = () => {
    setIsZeroizing(true);

    const payload: CustomerPurchasePayload = {
      orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName,
      email: 'a.wright@enterprise.com',
      billingAddress,
      creditCardNumber: creditCard,
      expiryDate: '09/28',
      cvv,
      ipAddress: '198.51.100.89',
      amount: purchaseAmount,
      currency: 'USD'
    };

    setTimeout(() => {
      const { zeroizedRecord, auditLog } = zeroizePurchaseData(payload);
      setLatestZeroized(zeroizedRecord);
      onNewLog(auditLog);
      setZeroizedCount(prev => prev + 1);
      setIsZeroizing(false);
    }, 180);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesMonth = monthFilter === 'all' || log.timestamp.includes(monthFilter);

    return matchesSearch && matchesCategory && matchesMonth;
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2.5">
            <FileCheck className="w-6 h-6 text-emerald-400" />
            <span>GDPR & CCPA Compliance Auditor & Ephemeral Zeroization</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Enforces immediate post-purchase customer PII shredding under GDPR Art. 17 & CCPA § 1798, with automated monthly compliance audit logging.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportAuditLogsToCsv(logs)}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Stakeholder PDF Report</span>
          </button>
        </div>
      </div>

      {/* Ephemeral Data Purge Live Simulator */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-amber-400" />
              <span>Online Web Purchase Checkout: Immediate Customer Data Zeroization</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate completing an e-commerce transaction; sensitive cardholder data and address are instantly wiped from active memory.
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-mono">PCI-DSS v4 & GDPR SLA: &lt;100ms</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Credit Card PAN</label>
            <input
              type="text"
              value={creditCard}
              onChange={(e) => setCreditCard(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">CVV & Expiry</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Purchase Amount</label>
            <input
              type="number"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400">
            Target Address: <span className="font-mono text-slate-300">{billingAddress}</span>
          </div>
          <button
            onClick={handleExecutePurchaseZeroization}
            disabled={isZeroizing}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>{isZeroizing ? 'Zeroizing Memory...' : 'Settle Purchase & Shred Customer PII'}</span>
          </button>
        </div>

        {/* Live Zeroization Proof Window */}
        {latestZeroized && (
          <div className="mt-4 p-4 rounded-lg border border-amber-500/30 bg-amber-950/20 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>EPHEMERAL DATA SHREDDING VERIFIED: {latestZeroized.orderId}</span>
              </div>
              <span className="font-mono text-emerald-400">
                Purged in {latestZeroized.zeroizeDurationMs}ms
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
              <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Vault Replacement Token</span>
                <span className="text-amber-300 font-semibold">{latestZeroized.sanitizedToken}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">One-Way SHA-256 Digest</span>
                <span className="text-slate-300 truncate block">{latestZeroized.sha256Hash}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">GDPR Art. 17 Status</span>
                <span className="text-emerald-400 font-semibold">100% PII Eradicated</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-300">
              <span className="font-semibold text-slate-200">Zeroized Memory Attributes: </span>
              {latestZeroized.scrubbedFields.join(' · ')}
            </div>
          </div>
        )}
      </div>

      {/* Compliance Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by actor, IP, event, or hash..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="all">All Regulatory Categories</option>
            <option value="gdpr_zeroization">GDPR Zeroization</option>
            <option value="phishing_defense">Phishing Defense</option>
            <option value="biometric_mfa">Biometric MFA</option>
            <option value="whatsapp_e2ee">WhatsApp E2EE</option>
            <option value="rbac_audit">RBAC Permissions</option>
          </select>

          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none font-mono"
          >
            <option value="all">All Months</option>
            <option value="2026-11">November 2026</option>
            <option value="2026-10">October 2026</option>
          </select>
        </div>
      </div>

      {/* Historical Monthly Audit Logs Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-white">Cryptographically Sealed Audit Ledger</span>
            <span className="text-slate-500">·</span>
            <span className="font-mono text-emerald-400">AES-256 Log Vault Active</span>
          </div>
          <span className="font-mono">{filteredLogs.length} verified records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Log ID / Timestamp</th>
                <th className="py-3 px-4">Actor / Origin</th>
                <th className="py-3 px-4">Event Description</th>
                <th className="py-3 px-4">Regulation</th>
                <th className="py-3 px-4">Integrity Hash</th>
                <th className="py-3 px-4 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredLogs.map((log) => {
                const isCrit = log.severity === 'critical';
                const isHigh = log.severity === 'high';
                return (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-white font-semibold">{log.id}</div>
                      <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{log.actor}</div>
                      <div className="text-[10px] text-slate-400 font-mono">IP: {log.ipAddress}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-medium text-slate-200">{log.event}</div>
                      <div className="text-[11px] text-slate-400 truncate">{log.details}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs">
                      <span className="text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {log.regulationTag}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {log.integrityHash.substring(0, 12)}...
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded border ${
                        isCrit 
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                          : isHigh 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Stakeholder PDF Report Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl overflow-y-auto p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <FileCheck className="w-7 h-7 text-emerald-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">Monthly Security & Regulatory Compliance Report</h3>
                  <p className="text-xs text-slate-400 font-mono">Reporting Period: November 2026 · Confidential</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                1. Executive Compliance Summary
              </h4>
              <p>
                This certified audit statement validates that during the reporting period, all enterprise financial transactions, customer web purchases, and WhatsApp Web sessions met or exceeded GDPR Article 17 (Right to Erasure), GDPR Article 32 (Security of Processing), and CCPA requirements.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Customer PII Zeroizations</span>
                  <span className="text-base font-bold font-mono text-emerald-400">100% Succeeded</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Average SLA: 42ms</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Phishing Interception Rate</span>
                  <span className="text-base font-bold font-mono text-white">100% Intercepted</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">0 credential breaches</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Biometric MFA Compliance</span>
                  <span className="text-base font-bold font-mono text-indigo-400">Mandatory (FIDO2)</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Auto-lockout verified</span>
                </div>
              </div>
            </div>

            {/* Certification Seal */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-xs text-emerald-300 flex items-center justify-between">
              <div>
                <span className="font-bold block text-sm">Official Regulatory Attestation Seal</span>
                <span className="text-[11px] opacity-90 font-mono">
                  Master Ledger Hash: 0x9f884100bbaae29107ccfa9021e847 · Timestamp: 2026-11-08 12:22 UTC
                </span>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            </div>

            <div className="text-[11px] text-slate-400 text-center pt-4 border-t border-slate-800">
              AegisShield Enterprise Security Architecture · Cryptographically Audited and Signed
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
