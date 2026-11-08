/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { OverviewDashboard } from './components/OverviewDashboard';
import { PhishingLinkScanner } from './components/PhishingLinkScanner';
import { WebBankingMfa } from './components/WebBankingMfa';
import { WhatsAppMonitor } from './components/WhatsAppMonitor';
import { TikTokGateway } from './components/TikTokGateway';
import { ComplianceAuditor } from './components/ComplianceAuditor';
import { RbacManager } from './components/RbacManager';
import { AlertCenterModal } from './components/AlertCenterModal';
import { ApiDocumentation } from './components/ApiDocumentation';
import { 
  UserRole, 
  SecurityAlert, 
  ComplianceAuditLog, 
  PhishingScanResult, 
  BankingTransaction 
} from './types/security';
import { INITIAL_ALERTS } from './services/threatStream';
import { INITIAL_AUDIT_LOGS } from './services/complianceEngine';
import { Shield, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [currentRole, setCurrentRole] = useState<UserRole>('super_admin');
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Core metrics & state
  const [blockedCount, setBlockedCount] = useState<number>(142);
  const [biometricCount, setBiometricCount] = useState<number>(389);
  const [zeroizedCount, setZeroizedCount] = useState<number>(842);

  // Alerts & Audit logs
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);
  const [auditLogs, setAuditLogs] = useState<ComplianceAuditLog[]>(INITIAL_AUDIT_LOGS);

  // Transient notification toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'success' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Synchronize dark class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle phishing threat blocked
  const handleThreatBlocked = (result: PhishingScanResult) => {
    setBlockedCount(prev => prev + 1);

    const newLog: ComplianceAuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: 'GATEWAY-INTERCEPT',
      actor: 'Phishing Filter Sentinel',
      event: `Malicious Link Neutralized: ${result.domain}`,
      category: 'phishing_defense',
      severity: result.confidenceScore >= 70 ? 'critical' : 'high',
      details: `Intercepted URL targeting financial account security: ${result.matchedRules[0] || 'Domain spoofing'}`,
      ipAddress: '198.51.100.89',
      regulationTag: 'GDPR_Art_32',
      integrityHash: `0x${Math.random().toString(16).substring(2, 10)}8f41`
    };

    setAuditLogs(prev => [newLog, ...prev]);

    const newAlert: SecurityAlert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      title: `Phishing Link Blocked: ${result.domain}`,
      description: `Inbound malicious link with ${result.confidenceScore}% risk confidence neutralized before user execution.`,
      severity: result.confidenceScore >= 70 ? 'critical' : 'high',
      source: 'Phishing Filter',
      timestamp: 'Just now',
      acknowledged: false,
      quarantineTriggered: true,
      channel: 'email_and_push'
    };

    setAlerts(prev => [newAlert, ...prev]);
    showToast(`Phishing link blocked: ${result.domain}`, 'warning');
  };

  // Handle successful biometric transaction
  const handleTransactionSuccess = (tx: BankingTransaction) => {
    setBiometricCount(prev => prev + 1);

    const newLog: ComplianceAuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: tx.userId,
      actor: 'Biometric MFA Sentinel',
      event: `Biometric Transaction Verified ($${tx.amount.toLocaleString()} ${tx.currency})`,
      category: 'biometric_mfa',
      severity: 'info',
      details: `FIDO2 TouchID challenge validated for ${tx.recipient} at ${tx.recipientBank}.`,
      ipAddress: '198.51.100.45',
      regulationTag: 'PCI_DSS_v4',
      integrityHash: `0x${Math.random().toString(16).substring(2, 10)}99ea`
    };

    setAuditLogs(prev => [newLog, ...prev]);
    showToast(`Biometric MFA verified: $${tx.amount.toLocaleString()} transfer authorized`);
  };

  // Handle biometric mismatch & lockout
  const handleLockoutTriggered = (tx: BankingTransaction, reason: string) => {
    const newAlert: SecurityAlert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      title: 'CRITICAL: Account Frozen (Biometric Mismatch)',
      description: `${reason} on transaction ${tx.id}. Immediate quarantine executed.`,
      severity: 'critical',
      source: 'Biometric Guard',
      timestamp: 'Just now',
      acknowledged: false,
      quarantineTriggered: true,
      channel: 'email_and_push'
    };

    setAlerts(prev => [newAlert, ...prev]);

    const newLog: ComplianceAuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: tx.userId,
      actor: 'Biometric MFA Sentinel',
      event: 'Unidentified User: Immediate Account Lockout Triggered',
      category: 'biometric_mfa',
      severity: 'critical',
      details: `Failed biometric verification for transfer of $${tx.amount.toLocaleString()}. Account frozen immediately per regulatory safeguard.`,
      ipAddress: '91.240.118.99',
      regulationTag: 'GLBA',
      integrityHash: `0x${Math.random().toString(16).substring(2, 10)}cc89`
    };

    setAuditLogs(prev => [newLog, ...prev]);
    showToast('CRITICAL: Account quarantined due to biometric mismatch!', 'warning');
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
    showToast('Security alert acknowledged');
  };

  const handleDispatchTestAlert = (newAlert: SecurityAlert) => {
    setAlerts(prev => [newAlert, ...prev]);
    showToast(`Dispatched alert: ${newAlert.title}`, 'warning');
  };

  const unreadAlertCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900 transition-colors">
      {/* Top Bar Contract Navigation */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        unreadAlertCount={unreadAlertCount}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewDashboard
            onNavigate={setActiveTab}
            alerts={alerts}
            recentLogs={auditLogs}
            blockedCount={blockedCount}
            biometricCount={biometricCount}
            zeroizedCount={zeroizedCount}
            isOffline={isOffline}
          />
        )}

        {activeTab === 'phishing' && (
          <PhishingLinkScanner
            onThreatBlocked={handleThreatBlocked}
          />
        )}

        {activeTab === 'banking_mfa' && (
          <WebBankingMfa
            onTransactionSuccess={handleTransactionSuccess}
            onLockoutTriggered={handleLockoutTriggered}
          />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppMonitor
            onThreatIntercepted={handleThreatBlocked}
          />
        )}

        {activeTab === 'tiktok' && (
          <TikTokGateway />
        )}

        {activeTab === 'compliance' && (
          <ComplianceAuditor
            logs={auditLogs}
            onNewLog={(log) => setAuditLogs(prev => [log, ...prev])}
            zeroizedCount={zeroizedCount}
            setZeroizedCount={setZeroizedCount}
          />
        )}

        {activeTab === 'rbac' && (
          <RbacManager
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
            onRoleChangedNotice={(msg) => showToast(msg)}
          />
        )}

        {activeTab === 'api_docs' && (
          <ApiDocumentation />
        )}
      </main>

      {/* Alerts Modal */}
      <AlertCenterModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        onAcknowledgeAlert={handleAcknowledgeAlert}
        onDispatchTestAlert={handleDispatchTestAlert}
      />

      {/* Transient Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-xs font-medium animate-in fade-in slide-in-from-bottom-2 bg-slate-900 border-slate-700 text-white">
          {toastMessage.type === 'warning' ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Clean Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">AegisShield Platform</span>
            <span>·</span>
            <span>Financial & Messaging Security Sentinel</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
            <span>GDPR Art. 17 Zero-Retention</span>
            <span>·</span>
            <span>CCPA § 1798 Compliant</span>
            <span>·</span>
            <span>FIDO2 WebAuthn L3</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
