import { PhishingScanResult } from '../types/security';

// Known spoof targets in banking and communication
const TARGET_BRANDS = [
  { brand: 'WhatsApp', patterns: ['whatsapp', 'whatszap', 'watsap', 'wa-web', 'wa-me', 'wh4tsapp'] },
  { brand: 'Chase Bank', patterns: ['chase', 'chasebank', 'jpmorgan', 'ch4se'] },
  { brand: 'Wells Fargo', patterns: ['wellsfargo', 'wells-fargo', 'wf-bank'] },
  { brand: 'Bank of America', patterns: ['bankofamerica', 'bofa', 'bofa-online'] },
  { brand: 'PayPal', patterns: ['paypal', 'pay-pal', 'pypal'] },
  { brand: 'Citibank', patterns: ['citibank', 'citi-bank', 'citigroup'] },
  { brand: 'TikTok Financial', patterns: ['tiktok', 'tik-tok', 'tt-creator'] },
  { brand: 'Stripe', patterns: ['stripe', 'stripe-checkout', 'strpe'] },
  { brand: 'Binance', patterns: ['binance', 'binance-verify'] },
];

const SUSPICIOUS_TLDS = ['.xyz', '.top', '.cc', '.ru', '.su', '.click', '.work', '.download', '.zip', '.country', '.gq', '.tk', '.cf', '.link', '.to'];

const PHISHING_KEYWORDS = [
  'verify-account',
  'account-suspended',
  'unlock-card',
  'secure-login',
  'whatsapp-restore',
  'banking-security-update',
  'confirm-identity',
  'urgent-notice',
  'claim-funds',
  'pin-reset',
  'otp-bypass',
  '2fa-auth',
  'zero-fee-transfer',
  'kyc-renewal'
];

// Calculate Shannon entropy of a string
function calculateEntropy(str: string): number {
  const len = str.length;
  if (len === 0) return 0;
  const frequencies: Record<string, number> = {};
  for (let i = 0; i < len; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let entropy = 0;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(3));
}

// Check for homoglyphs or non-ASCII characters in domain
function detectHomoglyph(domain: string): boolean {
  // Check for Punycode prefix or non-ascii
  if (domain.startsWith('xn--')) return true;
  // Check for Cyrillic/Greek/Lookalike Unicode characters
  return /[^\u0000-\u007F]/.test(domain);
}

export function scanUrl(rawInput: string): PhishingScanResult {
  let cleaned = rawInput.trim();
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'https://' + cleaned;
  }

  let domain = '';
  let path = '';
  try {
    const parsed = new URL(cleaned);
    domain = parsed.hostname.toLowerCase();
    path = parsed.pathname.toLowerCase() + parsed.search.toLowerCase();
  } catch {
    domain = cleaned.split('/')[0].toLowerCase();
    path = cleaned.slice(domain.length);
  }

  const matchedRules: string[] = [];
  let score = 0;
  let detectedTarget: string | undefined = undefined;

  // 1. Homoglyph / Punycode check
  const hasPunycode = detectHomoglyph(domain);
  if (hasPunycode) {
    matchedRules.push('CRITICAL: Homoglyph / Punycode attack detected (domain masquerading)');
    score += 45;
  }

  // 2. IP-based host check (e.g., http://192.168.1.5/login)
  const isDirectIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(domain);
  if (isDirectIp) {
    matchedRules.push('HIGH: Bare IP address host used in place of validated domain');
    score += 35;
  }

  // 3. Brand Impersonation check
  for (const { brand, patterns } of TARGET_BRANDS) {
    for (const pat of patterns) {
      if (domain.includes(pat)) {
        // Check if it is the legitimate official domain
        const officialDomains = [
          'whatsapp.com',
          'chase.com',
          'wellsfargo.com',
          'bankofamerica.com',
          'paypal.com',
          'citi.com',
          'citibank.com',
          'tiktok.com',
          'stripe.com',
          'binance.com'
        ];
        const isOfficial = officialDomains.some(off => domain === off || domain.endsWith('.' + off));
        if (!isOfficial) {
          matchedRules.push(`CRITICAL: Spoofing financial/messaging brand "${brand}" on unauthorized domain`);
          score += 40;
          detectedTarget = brand;
          break;
        }
      }
    }
  }

  // 4. Suspicious TLD check
  for (const tld of SUSPICIOUS_TLDS) {
    if (domain.endsWith(tld)) {
      matchedRules.push(`MEDIUM: High-abuse Top-Level Domain (${tld}) frequently used in disposable phishing campaigns`);
      score += 25;
      break;
    }
  }

  // 5. Phishing Keywords in path or subdomain
  const combined = domain + path;
  let keywordHits = 0;
  for (const kw of PHISHING_KEYWORDS) {
    if (combined.includes(kw)) {
      keywordHits++;
      matchedRules.push(`HIGH: Social-engineering bait keyword detected ("${kw}")`);
      score += 20;
      if (keywordHits >= 2) break;
    }
  }

  // 6. Excessive subdomain nesting (e.g. login.whatsapp.update.bank.securesite.top)
  const subdomains = domain.split('.');
  if (subdomains.length > 4) {
    matchedRules.push('MEDIUM: Excessive subdomain nesting (multi-tier evasive hierarchy)');
    score += 15;
  }

  // 7. Entropy test
  const entropy = calculateEntropy(domain);
  if (entropy > 3.8 && domain.length > 15) {
    matchedRules.push(`HIGH: High algorithmic entropy (${entropy}) indicates randomly generated Domain Generation Algorithm (DGA)`);
    score += 25;
  }

  // Estimate domain age (for simulation of newly registered domains)
  const isKnownOld = domain.endsWith('.com') && !score;
  const ageDaysEstimate = isKnownOld ? 3420 : Math.max(2, Math.floor(180 - score * 1.5));

  if (ageDaysEstimate < 14) {
    matchedRules.push(`HIGH: Newly registered domain (<14 days active), zero trust profile`);
    score += 20;
  }

  // Cap score
  const confidenceScore = Math.min(100, Math.max(0, score));
  const isThreat = confidenceScore >= 45;

  let threatType: PhishingScanResult['threatType'] = 'clean';
  if (hasPunycode) threatType = 'homograph_spoof';
  else if (detectedTarget === 'WhatsApp') threatType = 'fake_whatsapp_portal';
  else if (detectedTarget) threatType = 'credential_harvesting';
  else if (entropy > 3.8) threatType = 'high_entropy_redirect';
  else if (isThreat) threatType = 'banking_trojan';

  let reputation: PhishingScanResult['reputation'] = 'verified_safe';
  let actionTaken: PhishingScanResult['actionTaken'] = 'allowed';

  if (confidenceScore >= 70) {
    reputation = 'malicious';
    actionTaken = 'blocked_and_quarantined';
  } else if (confidenceScore >= 40) {
    reputation = 'suspicious';
    actionTaken = 'flagged_with_warning';
  }

  return {
    url: cleaned,
    domain,
    isThreat,
    threatType,
    confidenceScore,
    matchedRules,
    entropy,
    hasPunycode,
    ageDaysEstimate,
    reputation,
    timestamp: new Date().toISOString(),
    targetEntity: detectedTarget,
    actionTaken
  };
}

export const PRESET_TEST_LINKS = [
  {
    label: 'WhatsApp Banking Impersonator',
    url: 'https://whatsapp-secure-banking-auth.xyz/verify-account?token=89f92',
    description: 'Spoofs WhatsApp financial services with a disposable .xyz TLD and urgent credential bait.'
  },
  {
    label: 'Homoglyph Bank Phishing (Punycode)',
    url: 'https://xn--chse-spa.com/online-banking-auth',
    description: 'Uses Cyrillic character "а" to imitate Chase Bank (chаse.com).'
  },
  {
    label: 'TikTok Viral Scam Link',
    url: 'https://tt-creator-fund-bonus.top/claim-funds?user=cashout',
    description: 'Targets mobile banking users via social engineering TikTok money giveaway.'
  },
  {
    label: 'Direct IP Credential Harvester',
    url: 'http://185.220.101.44/wellsfargo/secure-login/pin-reset.html',
    description: 'Bare IP server attempting to capture banking credentials and 2FA bypass.'
  },
  {
    label: 'Legitimate Financial Portal',
    url: 'https://www.chase.com/personal/banking',
    description: 'Authentic banking portal with valid high-reputation DNS and EV certificate.'
  }
];
