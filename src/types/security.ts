export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type UserRole = 
  | 'super_admin'
  | 'soc_analyst'
  | 'compliance_officer'
  | 'finance_operator';

export interface RoleDefinition {
  id: UserRole;
  name: string;
  description: string;
  permissions: string[];
}

export interface PhishingScanResult {
  url: string;
  domain: string;
  isThreat: boolean;
  threatType: 'credential_harvesting' | 'homograph_spoof' | 'fake_whatsapp_portal' | 'banking_trojan' | 'high_entropy_redirect' | 'clean';
  confidenceScore: number; // 0-100 (100 = malicious)
  matchedRules: string[];
  entropy: number;
  hasPunycode: boolean;
  ageDaysEstimate: number;
  reputation: 'malicious' | 'suspicious' | 'verified_safe';
  timestamp: string;
  targetEntity?: string;
  actionTaken: 'blocked_and_quarantined' | 'flagged_with_warning' | 'allowed';
}

export interface BiometricChallenge {
  id: string;
  transactionId: string;
  accountNumber: string;
  amount: number;
  currency: string;
  recipient: string;
  recipientBank: string;
  riskScore: number;
  riskFactors: string[];
  biometricMethod: 'touch_id' | 'face_id' | 'windows_hello' | 'fido2_key';
  status: 'pending' | 'authenticated' | 'failed' | 'quarantined';
  deviceAttestation: string;
  timestamp: string;
}

export interface BankingTransaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  recipient: string;
  recipientBank: string;
  type: 'wire_transfer' | 'instant_p2p' | 'international_ach' | 'e-commerce_purchase';
  status: 'completed' | 'blocked_unverified' | 'pending_biometric' | 'quarantined';
  biometricVerified: boolean;
  riskLevel: 'low' | 'medium' | 'critical';
  timestamp: string;
  zeroized: boolean;
}

export interface WhatsAppSession {
  sessionId: string;
  deviceName: string;
  os: string;
  ipAddress: string;
  location: string;
  qrVerifiedAt: string;
  e2eeProtocol: 'Signal_v3_DoubleRatchet';
  keyExchange: 'Curve25519_ECDH';
  cipherSuite: 'AES-256-GCM_HMAC_SHA256';
  ratchetStep: number;
  forwardSecrecy: boolean;
  status: 'connected_encrypted' | 'link_threat_intercepted' | 'unpaired';
  interceptedThreatsCount: number;
}

export interface WhatsAppMessage {
  id: string;
  sender: string;
  senderNumber: string;
  timestamp: string;
  content: string;
  hasLink: boolean;
  linkUrl?: string;
  scanResult?: PhishingScanResult;
  isEncrypted: boolean;
  intercepted: boolean;
}

export interface TikTokVerification {
  id: string;
  contentTitle: string;
  creatorHandle: string;
  sharedLink: string;
  verificationToken: string;
  status: 'verified_authentic' | 'scam_flagged' | 'pending_review';
  cryptoSignature: string;
  watermarkHash: string;
  riskAssessment: string;
  createdAt: string;
}

export interface ComplianceAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  actor: string;
  event: string;
  category: 'phishing_defense' | 'biometric_mfa' | 'gdpr_zeroization' | 'ccpa_request' | 'whatsapp_e2ee' | 'rbac_audit';
  severity: Severity;
  details: string;
  ipAddress: string;
  regulationTag: 'GDPR_Art_17' | 'GDPR_Art_32' | 'CCPA_1798' | 'PCI_DSS_v4' | 'GLBA';
  integrityHash: string;
}

export interface SecurityAlert {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  source: 'Phishing Filter' | 'Biometric Guard' | 'WhatsApp E2EE' | 'GDPR Erasure' | 'SOC Vulnerability Monitor';
  timestamp: string;
  acknowledged: boolean;
  quarantineTriggered: boolean;
  channel: 'email_and_push' | 'push_only' | 'soc_console';
}

export interface SystemRegionStatus {
  region: string;
  location: string;
  status: 'optimal' | 'degraded' | 'syncing';
  latencyMs: number;
  throughput: string;
  encryptionStatus: 'AES-256-GCM Active';
}

export type BinanceAiAttackType = 
  | 'deepfake_biometric_spoof'
  | 'ai_agent_flash_drain'
  | 'llm_adversarial_phishing'
  | 'unidentified_geo_velocity'
  | 'automated_headless_bot';

export interface BinanceAiThreatIncident {
  id: string;
  attackType: BinanceAiAttackType;
  title: string;
  description: string;
  detectionSignature: string;
  riskConfidence: number; // 0 - 100
  sourceIp: string;
  location: string;
  timestamp: string;
  mitigationAction: 'kill_switch_activated' | 'withdrawal_frozen_24h' | 'api_key_revoked' | 'deepfake_rejected';
  status: 'intercepted_and_neutralized' | 'under_quarantine';
}

export interface BinanceAccountGuardState {
  accountUid: string;
  antiPhishingCode: string;
  accountStatus: 'secure_active' | 'emergency_frozen' | 'withdrawal_cooldown';
  yubiKeyFidoEnforced: boolean;
  withdrawalWhitelistOnly: boolean;
  aiDeepfakeProtection: boolean;
  apiIpWhitelistEnforced: boolean;
  activeCooldownHoursRemaining: number;
  blockedAiAttacksCount: number;
}

