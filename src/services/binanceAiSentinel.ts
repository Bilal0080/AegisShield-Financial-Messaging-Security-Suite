import { BinanceAiThreatIncident, BinanceAccountGuardState } from '../types/security';

export const INITIAL_BINANCE_GUARD: BinanceAccountGuardState = {
  accountUid: 'BIN-UID-98210492',
  antiPhishingCode: 'AEGIS-BINANCE-2026-SHIELD',
  accountStatus: 'secure_active',
  yubiKeyFidoEnforced: true,
  withdrawalWhitelistOnly: true,
  aiDeepfakeProtection: true,
  apiIpWhitelistEnforced: true,
  activeCooldownHoursRemaining: 0,
  blockedAiAttacksCount: 6
};

export const INITIAL_BINANCE_INCIDENTS: BinanceAiThreatIncident[] = [
  {
    id: 'BIN-SEC-8012',
    attackType: 'deepfake_biometric_spoof',
    title: 'Generative AI Deepfake Facial Verification Intercepted',
    description: 'An attacker uploaded a synthetic 60fps AI face clone attempting to bypass Binance KYC withdrawal face verification. Neutralized by spectral 3D depth and pupil micro-saccade sensor.',
    detectionSignature: 'SIG_GAN_SYNTHETIC_LIVENESS_FAIL (0.988 confidence)',
    riskConfidence: 99,
    sourceIp: '185.220.101.5',
    location: 'Tor Exit Node / Anonymous Proxy',
    timestamp: '14 minutes ago',
    mitigationAction: 'deepfake_rejected',
    status: 'intercepted_and_neutralized'
  },
  {
    id: 'BIN-SEC-8011',
    attackType: 'ai_agent_flash_drain',
    title: 'Autonomous AI Flash-Drain API Sweep Blocked',
    description: 'Automated AI agent script executed rapid sub-second withdrawal requests of 42.5 ETH to an unwhitelisted contract. API key revoked and 24-hour security lock activated.',
    detectionSignature: 'SIG_HIGH_VELOCITY_DRAIN_ROBOTICS (42ms interval)',
    riskConfidence: 96,
    sourceIp: '194.26.29.112',
    location: 'Hosting Facility, Frankfurt (DE)',
    timestamp: '1 hour ago',
    mitigationAction: 'withdrawal_frozen_24h',
    status: 'intercepted_and_neutralized'
  },
  {
    id: 'BIN-SEC-8010',
    attackType: 'unidentified_geo_velocity',
    title: 'Impossible Travel Geo-Velocity Anomaly Detected',
    description: 'Active session in Singapore; subsequent authenticated API session initialized 3 minutes later from Bucharest, Romania. Velocity delta exceeded physical travel threshold (6,200 km/h).',
    detectionSignature: 'SIG_IMPOSSIBLE_GEO_VELOCITY_TIME_TRAVEL',
    riskConfidence: 94,
    sourceIp: '91.240.118.80',
    location: 'Bucharest, Romania',
    timestamp: '3 hours ago',
    mitigationAction: 'kill_switch_activated',
    status: 'intercepted_and_neutralized'
  },
  {
    id: 'BIN-SEC-8009',
    attackType: 'llm_adversarial_phishing',
    title: 'AI LLM Spear-Phishing Attack Neutralized',
    description: 'Phishing email formatted with Binance branding claimed "Unauthorized API Device Connected - Verify Within 15 Mins". Detected missing verified Anti-Phishing Code (AEGIS-BINANCE-2026-SHIELD).',
    detectionSignature: 'SIG_MISSING_ANTI_PHISHING_WATERMARK',
    riskConfidence: 91,
    sourceIp: '104.244.42.1',
    location: 'MTA Relayer, Dallas (US)',
    timestamp: '6 hours ago',
    mitigationAction: 'kill_switch_activated',
    status: 'intercepted_and_neutralized'
  }
];

export interface AiAttackScenario {
  type: BinanceAiThreatIncident['attackType'];
  label: string;
  description: string;
  detectionSignature: string;
  sourceIp: string;
  location: string;
  mitigation: BinanceAiThreatIncident['mitigationAction'];
}

export const AI_ATTACK_SCENARIOS: AiAttackScenario[] = [
  {
    type: 'deepfake_biometric_spoof',
    label: 'AI Deepfake KYC / Video Selfie Spoof',
    description: 'Adversary uses Real-Time DeepFaceLive / Generative AI diffusion model to simulate victim face for facial verification during withdrawal.',
    detectionSignature: 'SIG_DEEPFAKE_DIFFUSION_BOUNDARY_MISMATCH',
    sourceIp: '185.191.171.12',
    location: 'Helsinki, Finland (VPN Node)',
    mitigation: 'deepfake_rejected'
  },
  {
    type: 'ai_agent_flash_drain',
    label: 'Autonomous AI API Key Drain Bot',
    description: 'Autonomous trading bot compromised an API key and triggered instant batch withdrawals to burner wallet in < 50ms.',
    detectionSignature: 'SIG_API_AUTOMATED_NONCE_FLOOD',
    sourceIp: '45.154.255.89',
    location: 'Amsterdam, Netherlands (High-Freq Bot Farm)',
    mitigation: 'withdrawal_frozen_24h'
  },
  {
    type: 'unidentified_geo_velocity',
    label: 'Unidentified Travel Geo-Velocity Login',
    description: 'Login attempt from unauthorized geographic zone 180 seconds after domestic activity, indicating cookie theft or session hijack.',
    detectionSignature: 'SIG_ANOMALOUS_GEOLOCATION_TOKEN_JUMP',
    sourceIp: '193.106.191.22',
    location: 'Saint Petersburg, Russia',
    mitigation: 'kill_switch_activated'
  },
  {
    type: 'llm_adversarial_phishing',
    label: 'Adversarial AI Phishing (Anti-Phishing Code Bypass)',
    description: 'Phishing attack mimicking Binance Risk Control Center. Lacks user custom Anti-Phishing Code.',
    detectionSignature: 'SIG_INVALID_ANTI_PHISHING_SIGNATURE',
    sourceIp: '185.220.103.7',
    location: 'Tor Exit Node (FR)',
    mitigation: 'kill_switch_activated'
  }
];
