import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  ShieldAlert, 
  Mail, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2,
  Send,
  Lock
} from 'lucide-react';
import { SecurityAlert } from '../types/security';

interface AlertCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: SecurityAlert[];
  onAcknowledgeAlert: (id: string) => void;
  onDispatchTestAlert: (alert: SecurityAlert) => void;
}

export const AlertCenterModal: React.FC<AlertCenterModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onAcknowledgeAlert,
  onDispatchTestAlert
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [notificationChannelEmail, setNotificationChannelEmail] = useState(true);
  const [notificationChannelPush, setNotificationChannelPush] = useState(true);

  if (!isOpen) return null;

  const filteredAlerts = alerts.filter(a => {
    if (selectedFilter === 'unread') return !a.acknowledged;
    if (selectedFilter === 'critical') return a.severity === 'critical';
    return true;
  });

  const handleCreateTestIncident = () => {
    const newAlert: SecurityAlert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      title: 'Manual Phishing Interception Drill Dispatched',
      description: 'Admin triggered simulated credential spoof test on WhatsApp Treasury gateway. Automatic heuristic defense verified.',
      severity: 'high',
      source: 'Phishing Filter',
      timestamp: 'Just now',
      acknowledged: false,
      quarantineTriggered: true,
      channel: notificationChannelEmail && notificationChannelPush ? 'email_and_push' : 'push_only'
    };
    onDispatchTestAlert(newAlert);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Security Alerts & Notification Dispatcher</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dispatcher Notification Channels */}
        <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationChannelPush}
                onChange={(e) => setNotificationChannelPush(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-indigo-600"
              />
              <span className="flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" /> Push Notifications
              </span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationChannelEmail}
                onChange={(e) => setNotificationChannelEmail(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-indigo-600"
              />
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email Broadcasts (SOC)
              </span>
            </label>
          </div>

          <button
            onClick={handleCreateTestIncident}
            className="px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 font-mono text-[11px] flex items-center gap-1 transition-colors"
          >
            <Send className="w-3 h-3" />
            <span>Simulate Urgent Incident Alert</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-2.5 border-b border-slate-800 flex items-center gap-2 text-xs">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 rounded-md transition-colors ${
              selectedFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setSelectedFilter('unread')}
            className={`px-3 py-1 rounded-md transition-colors ${
              selectedFilter === 'unread' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Unacknowledged ({alerts.filter(a => !a.acknowledged).length})
          </button>
          <button
            onClick={() => setSelectedFilter('critical')}
            className={`px-3 py-1 rounded-md transition-colors ${
              selectedFilter === 'critical' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Critical Only
          </button>
        </div>

        {/* Alert List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No active alerts matching this filter.
            </div>
          ) : (
            filteredAlerts.map((alt) => {
              const isCrit = alt.severity === 'critical';
              const isHigh = alt.severity === 'high';
              return (
                <div
                  key={alt.id}
                  className={`p-4 rounded-xl border transition-all ${
                    !alt.acknowledged
                      ? isCrit
                        ? 'border-rose-500/40 bg-rose-950/20'
                        : 'border-amber-500/40 bg-amber-950/20'
                      : 'border-slate-800 bg-slate-900/60 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{alt.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">[{alt.id}]</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-[11px] text-slate-400">{alt.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {alt.description}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                        <span>Source: {alt.source}</span>
                        <span>·</span>
                        <span>Channel: {alt.channel.replace(/_/g, ' ')}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                        isCrit 
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                          : isHigh 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}>
                        {alt.severity}
                      </span>

                      {!alt.acknowledged && (
                        <button
                          onClick={() => onAcknowledgeAlert(alt.id)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Acknowledge</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Urgent notifications dispatched instantly via Push & TLS SMTP</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
