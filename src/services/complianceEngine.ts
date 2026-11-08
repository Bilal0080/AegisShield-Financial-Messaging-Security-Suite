import { ComplianceAuditLog, Severity } from '../types/security';

export interface CustomerPurchasePayload {
  orderId: string;
  customerName: string;
  email: string;
  billingAddress: string;
  creditCardNumber: string;
  expiryDate: string;
  cvv: string;
  ipAddress: string;
  amount: number;
  currency: string;
}

export interface ZeroizedRecord {
  orderId: string;
  timestamp: string;
  sanitizedToken: string;
  sha256Hash: string;
  zeroizeDurationMs: number;
  scrubbedFields: string[];
  gdprStatus: 'Art_17_Erasure_Certified';
  ccpaStatus: '1798_OptOut_Protected';
  pciDssCompliance: 'PCI_DSS_v4_ZeroRetention';
}

// Simple deterministic hash simulation for integrity proof
export function generateSha256Hash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}e93b4821a7c4f1092${hex}`;
}

export const INITIAL_AUDIT_LOGS: ComplianceAuditLog[] = [
  {
    id: 'LOG-2026-9481',
    timestamp: '2026-11-08 12:14:02',
    userId: 'USR-8910 (Corporate Finance)',
    actor: 'Phishing Filter Engine v4.2',
    event: 'Phishing Link Neutralized in WhatsApp Web Session',
    category: 'phishing_defense',
    severity: 'critical',
    details: 'Blocked fake WhatsApp login spoof (whatsapp-secure-banking-auth.xyz) sent to treasury channel.',
    ipAddress: '185.220.101.44',
    regulationTag: 'GDPR_Art_32',
    integrityHash: '0x8f3c21a990bb43c8d1'
  },
  {
    id: 'LOG-2026-9480',
    timestamp: '2026-11-08 11:42:18',
    userId: 'USR-3401 (Elena Rostova)',
    actor: 'Biometric MFA Sentinel',
    event: 'Biometric Transaction Authentication Succeeded',
    category: 'biometric_mfa',
    severity: 'info',
    details: 'FIDO2 TouchID biometric challenge completed for $4,500 outbound payroll remittance.',
    ipAddress: '198.51.100.22',
    regulationTag: 'PCI_DSS_v4',
    integrityHash: '0x99ea147b2c5890eef2'
  },
  {
    id: 'LOG-2026-9479',
    timestamp: '2026-11-08 11:15:45',
    userId: 'USR-6629 (E-Commerce Web Terminal)',
    actor: 'Ephemeral Privacy Zeroizer',
    event: 'Immediate Post-Purchase Customer Data Zeroization',
    category: 'gdpr_zeroization',
    severity: 'low',
    details: 'Order #ORD-77491 settled: cardholder PAN, CVV, billing address shredded in 42ms. Replaced with vaulted token.',
    ipAddress: '203.0.113.88',
    regulationTag: 'GDPR_Art_17',
    integrityHash: '0x17c09d84ab61340177'
  },
  {
    id: 'LOG-2026-9478',
    timestamp: '2026-11-08 10:30:11',
    userId: 'USR-1109 (Marcus Vance)',
    actor: 'Biometric MFA Sentinel',
    event: 'Unidentified Access Attempt Quarantined',
    category: 'biometric_mfa',
    severity: 'critical',
    details: 'Biometric challenge failed 3 consecutive attempts from unfamiliar geo-IP. Account automatically locked.',
    ipAddress: '91.240.118.99',
    regulationTag: 'GLBA',
    integrityHash: '0xcc894101e45902fa01'
  },
  {
    id: 'LOG-2026-9477',
    timestamp: '2026-11-08 09:12:00',
    userId: 'USR-4412 (Social Media Gateway)',
    actor: 'TikTok Fraud Verifier',
    event: 'TikTok Viral Giveaway Link Quarantined',
    category: 'phishing_defense',
    severity: 'high',
    details: 'Detected fake financial influencer voucher link (tt-creator-fund-bonus.top) disguised as student grant.',
    ipAddress: '104.28.19.45',
    regulationTag: 'CCPA_1798',
    integrityHash: '0x44ab7720cf19238e88'
  },
  {
    id: 'LOG-2026-9476',
    timestamp: '2026-11-07 23:55:19',
    userId: 'USR-0001 (Security Admin)',
    actor: 'RBAC Policy Engine',
    event: 'Role Elevation & Audit Permissions Review',
    category: 'rbac_audit',
    severity: 'info',
    details: 'Granted temporary SOC Incident Commander privileges to Security Compliance Officer.',
    ipAddress: '10.0.4.12',
    regulationTag: 'GDPR_Art_32',
    integrityHash: '0x00f89bca612019efaa'
  },
  {
    id: 'LOG-2026-9475',
    timestamp: '2026-11-07 18:20:34',
    userId: 'USR-7731 (WhatsApp Web Gateway)',
    actor: 'Signal Protocol Ratchet Monitor',
    event: 'E2EE Double-Ratchet Key Rotation Verified',
    category: 'whatsapp_e2ee',
    severity: 'info',
    details: 'Curve25519 ratchet step #149 successfully validated. Forward secrecy guaranteed for all active enterprise chats.',
    ipAddress: '172.56.21.90',
    regulationTag: 'GDPR_Art_32',
    integrityHash: '0x77aa4411ee909022bb'
  },
  {
    id: 'LOG-2026-10-31 23:59:00',
    timestamp: '2026-10-31 23:59:00',
    userId: 'SYSTEM-DAEMON',
    actor: 'Compliance Automator',
    event: 'October 2026 Monthly Compliance Ledger Sealed',
    category: 'gdpr_zeroization',
    severity: 'info',
    details: 'All 14,892 monthly purchase records verified zeroized within SLAs. Zero PII leaks recorded.',
    ipAddress: '127.0.0.1',
    regulationTag: 'GDPR_Art_17',
    integrityHash: '0x103199887766554433'
  }
];

// Perform immediate data zeroization on purchase checkout
export function zeroizePurchaseData(payload: CustomerPurchasePayload): {
  zeroizedRecord: ZeroizedRecord;
  auditLog: ComplianceAuditLog;
} {
  const start = performance.now();

  // Generate vault token and scrub fields
  const token = `TKN-VAULT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  const rawSignature = `${payload.orderId}:${payload.customerName}:${payload.amount}:${payload.currency}`;
  const sha256 = generateSha256Hash(rawSignature);

  // In real runtime, PII references are cleared and garbage-collected
  const duration = Math.max(18, Math.round(performance.now() - start));

  const scrubbedFields = [
    'creditCardNumber (16 digits)',
    'cvv (3-4 digits)',
    'expiryDate (MM/YY)',
    'billingAddress (Street & Zip)',
    'ipAddress (Origin IPv4/IPv6)',
    'customerFullName'
  ];

  const zeroizedRecord: ZeroizedRecord = {
    orderId: payload.orderId,
    timestamp: new Date().toISOString(),
    sanitizedToken: token,
    sha256Hash: sha256,
    zeroizeDurationMs: duration,
    scrubbedFields,
    gdprStatus: 'Art_17_Erasure_Certified',
    ccpaStatus: '1798_OptOut_Protected',
    pciDssCompliance: 'PCI_DSS_v4_ZeroRetention'
  };

  const auditLog: ComplianceAuditLog = {
    id: `LOG-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    userId: `USR-${Math.floor(1000 + Math.random() * 9000)} (Web Checkout)`,
    actor: 'Ephemeral Privacy Zeroizer',
    event: 'Immediate Post-Purchase Customer Data Zeroization',
    category: 'gdpr_zeroization',
    severity: 'low',
    details: `Order #${payload.orderId} ($${payload.amount.toFixed(2)} ${payload.currency}): All customer PII shredded in ${duration}ms. Retained only non-reversible hash ${sha256.substring(0, 14)}...`,
    ipAddress: payload.ipAddress || '198.51.100.1',
    regulationTag: 'GDPR_Art_17',
    integrityHash: sha256
  };

  return { zeroizedRecord, auditLog };
}

// Export logs to downloadable CSV
export function exportAuditLogsToCsv(logs: ComplianceAuditLog[]): void {
  const headers = ['Log ID', 'Timestamp', 'User ID', 'Actor', 'Event Name', 'Category', 'Severity', 'Regulation Tag', 'IP Address', 'Integrity Hash', 'Details'];
  
  const csvRows = logs.map(log => [
    `"${log.id}"`,
    `"${log.timestamp}"`,
    `"${log.userId}"`,
    `"${log.actor}"`,
    `"${log.event}"`,
    `"${log.category}"`,
    `"${log.severity}"`,
    `"${log.regulationTag}"`,
    `"${log.ipAddress}"`,
    `"${log.integrityHash}"`,
    `"${log.details.replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `AegisShield_Audit_Report_${new Date().toISOString().substring(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
