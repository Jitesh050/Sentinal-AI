import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface ScanOptions {
  url?: string;
  scanType?: 'Quick' | 'Full' | 'Custom';
  username?: string;
  password?: string;
}

interface ScanContextType {
  scanResult: any;
  setScanResult: (r: any) => void;
  scanOptions: ScanOptions;
  setScanOptions: (o: ScanOptions) => void;
  triggerScan: (options: ScanOptions) => Promise<void>;
  loading: boolean;
  error: string | null;
  lastUpdated: number;
  refreshAllPages: () => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

// Create a global variable to store the latest scan result
// This ensures it's accessible across all components even during route changes
let globalScanResult: any = null;

export function ScanProvider({ children }: { children: React.ReactNode }) {
  const [scanResult, setScanResult] = useState<any>(globalScanResult);
  const [scanOptions, setScanOptions] = useState<ScanOptions>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  // Force update all components using this context when scan result changes
  useEffect(() => {
    // This effect runs whenever scanResult changes
    if (scanResult) {
      console.log('Scan result updated:', scanResult.url);
      // Store in global variable to persist across route changes
      globalScanResult = scanResult;
      // Update timestamp to force re-renders in components using this context
      setLastUpdated(Date.now());
    }
  }, [scanResult]);

  // Function to force refresh all pages
  const refreshAllPages = () => {
    console.log('Forcing refresh of all pages');
    setLastUpdated(Date.now());
  };

  // On mount, check if there's a global result to use
  useEffect(() => {
    if (globalScanResult && !scanResult) {
      console.log('Restoring scan result from global state:', globalScanResult.url);
      setScanResult(globalScanResult);
    }
  }, []);

  async function triggerScan(options: ScanOptions) {
    console.log('Triggering scan for URL:', options.url);
    // Clear previous results first to ensure clean state
    setScanResult(null);
    globalScanResult = null;
    setLoading(true);
    setError(null);
    setScanOptions(options);
    
    try {
      const form = new FormData();
      if (options.url) form.append('url', options.url);
      if (options.scanType) form.append('scan_type', options.scanType);
      if (options.username) form.append('username', options.username);
      if (options.password) form.append('password', options.password);
      
      console.log('Sending request to backend for URL:', options.url);
      const res = await fetch('http://127.0.0.1:5000/fullscan', {
        method: 'POST',
        body: form,
      });
      
      if (!res.ok) throw new Error(`Scan failed with status: ${res.status}`);
      
      const data = await res.json();
      console.log('Received scan result for URL:', options.url, data);
      
      // Ensure the URL is included in the result
      if (!data.url && options.url) {
        data.url = options.url;
      }
      
      // Update the scan result which will trigger the useEffect
      setScanResult(data);
      globalScanResult = data;

      // Store scan result in Firestore for this user
      try {
        const user = getAuth().currentUser;
        if (user) {
          await addDoc(collection(db, 'users', user.uid, 'scans'), {
            ...data,
            createdAt: serverTimestamp(),
          });
        }
      } catch (firebaseErr) {
        console.error('Failed to store scan in Firestore:', firebaseErr);
      }

      // Force refresh
      setLastUpdated(Date.now());
    } catch (err: any) {
      console.error('Scan error:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScanContext.Provider value={{ 
      scanResult, 
      setScanResult, 
      scanOptions, 
      setScanOptions, 
      triggerScan, 
      loading, 
      error, 
      lastUpdated,
      refreshAllPages
    }}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error('useScan must be used within a ScanProvider');
  return ctx;
}
