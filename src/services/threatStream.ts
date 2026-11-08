import { SecurityAlert, SystemRegionStatus, UserRole } from '../types/security';

export const INITIAL_ALERTS: SecurityAlert[] = [
  {
    id: 'ALT-9821',
    title: 'Phishing Attempt Intercepted on WhatsApp Banking Gateway',
    description: 'An external party sent a credential phishing URL (whatsapp-secure-banking-auth.xyz) to Treasury Account #4920. Blocked before link delivery.',
    severity: 'critical',
    source: 'Phishing Filter',
    timestamp: '2 minutes ago',
    acknowledged: false,
    quarantineTriggered: true,
    channel: 'email_and_push'
  },
  {
    id: 'ALT-9820',
    title: 'Anomalous Location Biometric Verification Required',
    description: 'Transaction $18,400 initiated from unfamiliar IP in Eastern Europe. Biometric step-up challenge generated; pending user response.',
    severity: 'high',
    source: 'Biometric Guard',
    timestamp: '18 minutes ago',
    acknowledged: false,
    quarantineTriggered: false,
    channel: 'push_only'
  },
  {
    id: 'ALT-9819',
    title: 'TikTok Viral Scampaign Infiltration Quarantined',
    description: 'Fraudulent voucher token mimicking student financial relief intercepted and blacklisted across all enterprise devices.',
    severity: 'high',
    source: 'Phishing Filter',
    timestamp: '42 minutes ago',
    acknowledged: true,
    quarantineTriggered: true,
    channel: 'soc_console'
  },
  {
    id: 'ALT-9818',
    title: 'Automated Post-Purchase Data Shredding Complete',
    description: '100% of customer credit card PANs & CVVs from morning web transactions successfully zeroized per GDPR Article 17.',
    severity: 'info',
    source: 'GDPR Erasure',
    timestamp: '1 hour ago',
    acknowledged: true,
    quarantineTriggered: false,
    channel: 'soc_console'
  }
];

export const SYSTEM_REGIONS: SystemRegionStatus[] = [
  {
    region: 'us-east-1 (N. Virginia)',
    location: 'Americas Hub',
    status: 'optimal',
    latencyMs: 14,
    throughput: '42.8k tx/sec',
    encryptionStatus: 'AES-256-GCM Active'
  },
  {
    region: 'eu-central-1 (Frankfurt)',
    location: 'EMEA GDPR Vault',
    status: 'optimal',
    latencyMs: 22,
    throughput: '38.1k tx/sec',
    encryptionStatus: 'AES-256-GCM Active'
  },
  {
    region: 'ap-southeast-1 (Singapore)',
    location: 'APAC Gateway',
    status: 'optimal',
    latencyMs: 31,
    throughput: '29.5k tx/sec',
    encryptionStatus: 'AES-256-GCM Active'
  }
];

export const ROLE_PERMISSIONS: Record<UserRole, { title: string; permissions: string[]; badgeColor: string }> = {
  super_admin: {
    title: 'Super Administrator',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    permissions: [
      'Full Security Console Override',
      'Manage Role-Based Access Controls',
      'Deploy Real-Time Phishing Rules',
      'Emergency Account Freeze & Unquarantine',
      'Seal & Sign Monthly Compliance Ledgers',
      'Configure Multi-Region Cloud Clusters',
      'View Decrypted Audit Proofs'
    ]
  },
  soc_analyst: {
    title: 'SOC Security Analyst',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    permissions: [
      'Real-Time Threat Monitoring & Incident Triage',
      'Execute On-Demand URL & Malicious Domain Scans',
      'Inspect WhatsApp E2EE Cryptographic Ratchets',
      'Acknowledge & Escalate Urgent Alerts',
      'Quarantine Compromised Endpoints'
    ]
  },
  compliance_officer: {
    title: 'Compliance & Privacy Officer',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    permissions: [
      'Audit GDPR Article 17 Data Zeroization Logs',
      'Verify CCPA Opt-Out Compliance Records',
      'Generate & Export Monthly Audit Reports (PDF/CSV)',
      'Inspect PCI-DSS v4 Tokenization Vaults',
      'Certify Cryptographic Integrity Hashes'
    ]
  },
  finance_operator: {
    title: 'Financial Operations Manager',
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    permissions: [
      'Initiate Corporate Transfers & Transactions',
      'Fulfill Biometric Multi-Factor Challenges',
      'Monitor Customer E-Commerce Purchase Zeroization',
      'Generate Secure TikTok Share Badges'
    ]
  }
};
