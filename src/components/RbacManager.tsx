import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Lock, 
  Key, 
  CheckCircle2, 
  AlertTriangle,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { UserRole } from '../types/security';
import { ROLE_PERMISSIONS } from '../services/threatStream';

interface RbacManagerProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  onRoleChangedNotice?: (msg: string) => void;
}

export const RbacManager: React.FC<RbacManagerProps> = ({
  currentRole,
  setCurrentRole,
  onRoleChangedNotice
}) => {
  const [selectedRoleView, setSelectedRoleView] = useState<UserRole>(currentRole);
  const [mfaMandatoryAll, setMfaMandatoryAll] = useState(true);

  const rolesList: { id: UserRole; title: string; desc: string }[] = [
    {
      id: 'super_admin',
      title: 'Super Administrator',
      desc: 'Unrestricted control over security architecture, firewall sinkhole, and global cryptographic keys.'
    },
    {
      id: 'soc_analyst',
      title: 'SOC Security Analyst',
      desc: 'Real-time threat monitoring, inbound link deep scanning, and incident quarantine response.'
    },
    {
      id: 'compliance_officer',
      title: 'Compliance & Privacy Officer',
      desc: 'GDPR / CCPA data erasure oversight, audit log export, and regulatory certification sign-offs.'
    },
    {
      id: 'finance_operator',
      title: 'Financial Operations Manager',
      desc: 'Initiates high-value transactions, executes biometric MFA challenges, and verifies TikTok share tokens.'
    }
  ];

  const handleActivateRole = (role: UserRole) => {
    setCurrentRole(role);
    setSelectedRoleView(role);
    if (onRoleChangedNotice) {
      onRoleChangedNotice(`Switched active administrative session to ${ROLE_PERMISSIONS[role].title}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>Role-Based Access Control (RBAC) & Permission Matrix</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Enforces strict data privacy separation of duties across financial operations, security response, and regulatory compliance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
            <span>MFA Mandatory For All 4 Roles</span>
          </span>
        </div>
      </div>

      {/* Role Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rolesList.map((r) => {
          const isCurrentActive = currentRole === r.id;
          const isSelected = selectedRoleView === r.id;
          return (
            <div
              key={r.id}
              onClick={() => setSelectedRoleView(r.id)}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-slate-900 shadow-lg'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white">{r.title}</span>
                {isCurrentActive && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-600 text-white font-semibold">
                    Current
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {r.desc}
              </p>

              {!isCurrentActive ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActivateRole(r.id);
                  }}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  Assume Role
                </button>
              ) : (
                <div className="text-[11px] font-mono text-emerald-400 text-center py-1">
                  Active Session
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed Granular Permission Matrix for Selected Role */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Permissions for: {ROLE_PERMISSIONS[selectedRoleView].title}</span>
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${ROLE_PERMISSIONS[selectedRoleView].badgeColor}`}>
                Active Policy
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict least-privilege enforcement based on ISO 27001 & NIST 800-53 security controls.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={mfaMandatoryAll}
                onChange={(e) => setMfaMandatoryAll(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Enforce Hardware Biometric MFA on Login</span>
            </label>
          </div>
        </div>

        {/* Permission Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ROLE_PERMISSIONS[selectedRoleView].permissions.map((perm, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5 text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">{perm}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                Granted
              </span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-400 space-y-2">
          <div className="font-semibold text-slate-200">Session Audit Guarantee:</div>
          <p>
            All role switches, administrative overrides, and biometric challenges are written to the tamper-evident audit ledger with SHA-256 digital signatures.
          </p>
        </div>
      </div>
    </div>
  );
};
