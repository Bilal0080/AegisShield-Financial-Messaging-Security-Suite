import React from 'react';
import { Shield, Bell, Wifi, WifiOff, Moon, Sun } from 'lucide-react';
import { UserRole } from '../types/security';
import { ROLE_PERMISSIONS } from '../services/threatStream';

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  unreadAlertCount: number;
  onOpenAlerts: () => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  unreadAlertCount,
  onOpenAlerts,
  isOffline,
  setIsOffline,
  isDarkMode,
  setIsDarkMode,
}) => {
  const navItems = [
    { id: 'overview', label: 'SOC Overview' },
    { id: 'binance', label: 'Binance AI Shield' },
    { id: 'phishing', label: 'Phishing Guardian' },
    { id: 'banking_mfa', label: 'Biometric Banking' },
    { id: 'whatsapp', label: 'WhatsApp E2EE' },
    { id: 'tiktok', label: 'TikTok Gateway' },
    { id: 'compliance', label: 'GDPR / CCPA Audits' },
    { id: 'rbac', label: 'Role Access' },
    { id: 'api_docs', label: 'API Reference' },
  ];

  const roleConfig = ROLE_PERMISSIONS[currentRole];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90 light:border-slate-200 light:bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <button 
              onClick={() => setActiveTab('overview')}
              className="text-lg font-bold tracking-tight text-white dark:text-white light:text-slate-900 whitespace-nowrap text-left"
            >
              AegisShield
            </button>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`transition-colors whitespace-nowrap py-1 relative ${
                    isActive
                      ? 'text-indigo-400 dark:text-indigo-400 light:text-indigo-600 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200 light:text-slate-600 light:hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Status Affordances */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Role indicator dropdown */}
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="hidden sm:block text-xs bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-700 dark:border-slate-700 light:border-slate-300 text-slate-200 dark:text-slate-200 light:text-slate-800 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              title="Switch user role"
            >
              <option value="super_admin">Super Admin</option>
              <option value="soc_analyst">SOC Analyst</option>
              <option value="compliance_officer">Compliance Officer</option>
              <option value="finance_operator">Finance Operator</option>
            </select>

            {/* Offline toggle */}
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`p-2 rounded-md border text-xs transition-colors flex items-center gap-1.5 ${
                isOffline
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border-slate-700 dark:border-slate-700 light:border-slate-300 text-slate-400 hover:text-slate-200'
              }`}
              title={isOffline ? 'Offline Mode Active (Cached)' : 'Live Multi-Region Connected'}
            >
              {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
              <span className="hidden md:inline">{isOffline ? 'Offline' : 'Live Sync'}</span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-md border border-slate-700 dark:border-slate-700 light:border-slate-300 bg-slate-900 dark:bg-slate-900 light:bg-slate-100 text-slate-400 hover:text-slate-200 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Alerts Bell */}
            <button
              onClick={onOpenAlerts}
              className="relative p-2 rounded-md border border-slate-700 dark:border-slate-700 light:border-slate-300 bg-slate-900 dark:bg-slate-900 light:bg-slate-100 text-slate-400 hover:text-slate-200 transition-colors"
              title="Security Alerts Center"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadAlertCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2.5 border-t border-slate-800 text-xs no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
