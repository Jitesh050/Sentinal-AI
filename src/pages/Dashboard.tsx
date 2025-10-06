import React, { useState, useEffect } from 'react';
import { ThreatLevelIndicator } from '../components/ThreatLevelIndicator';
import { AttackGraph } from '../components/AttackGraph';
import { VulnerabilityTable } from '../components/VulnerabilityTable';
import { AlertsPanel } from '../components/AlertsPanel';
import { useScan } from "@/contexts/ScanContext";

export default function Dashboard() {
  const { scanResult, triggerScan, loading, error, lastUpdated, refreshAllPages } = useScan();
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Force refresh when scan results change
  useEffect(() => {
    if (lastUpdated) {
      console.log('Dashboard: Detected scan result update, refreshing with URL:', scanResult?.url);
      setForceUpdate(prev => prev + 1);
    }
  }, [lastUpdated, scanResult?.url]);
  
  // Force refresh on component mount
  useEffect(() => {
    console.log('Dashboard: Component mounted, refreshing');
    refreshAllPages();
  }, []);
  const [url, setUrl] = useState('');
  const [scanType, setScanType] = useState<'Quick' | 'Full' | 'Custom'>('Quick');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleScan = () => {
    triggerScan({ url, scanType, username, password });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Vulnerability Scanner Dashboard</h1>
      <div className="flex flex-col space-y-4 mb-4">
        <input
          type="text"
          placeholder="Enter website URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="border px-2 py-1"
        />
        <div className="flex space-x-2">
          {(['Quick', 'Full', 'Custom'] as const).map(type => (
            <button
              key={type}
              className={`px-4 py-1 rounded ${scanType === type ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setScanType(type)}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Username (optional)"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="border px-2 py-1"
          />
          <input
            type="password"
            placeholder="Password (optional)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border px-2 py-1"
          />
        </div>
        <button
          onClick={handleScan}
          className="bg-blue-600 text-white px-4 py-1 rounded"
          disabled={loading}
        >
          {loading ? 'Scanning...' : 'Start Scan'}
        </button>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      {scanResult ? (
        <>
          <div className="mb-4">
            <span className="font-mono text-gray-400 text-xs">URL:</span>
            <span className="ml-2 text-cyber-blue font-mono text-xs">{scanResult?.url || scanResult?.scanOptions?.url || "(unknown)"}</span>
          </div>
          <ThreatLevelIndicator level={scanResult.threat_level} />
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Vulnerabilities</h2>
            <VulnerabilityTable data={scanResult.vulnerabilities} />
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Attack Graph</h2>
            <AttackGraph nodes={scanResult.network.nodes} edges={scanResult.network.edges} />
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Alerts</h2>
            <AlertsPanel alerts={scanResult.alerts} />
          </div>
        </>
      ) : (
        <div className="text-gray-400 text-center mt-8">No scan results available. Please run a scan from the Scanner page.</div>
      )}
    </div>
  );
}
