
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Check, X } from "lucide-react";

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoScan, setAutoScan] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);

  const handleThemeToggle = () => {
    toggleTheme();
    toast.success("Theme updated", {
      description: `Switched to ${theme === 'dark' ? 'light' : 'dark'} theme`,
      icon: theme === 'dark' ? <Check size={18} /> : <X size={18} />,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card className="cyber-card">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme-toggle" className="text-base">Light Theme</Label>
              <p className="text-sm text-gray-400 mt-1">
                Switch between dark and light mode
              </p>
            </div>
            <Switch 
              id="theme-toggle"
              checked={theme === 'light'}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="cyber-card">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications" className="text-base">Enable Notifications</Label>
              <p className="text-sm text-gray-400 mt-1">
                Receive alerts for critical security events
              </p>
            </div>
            <Switch 
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="cyber-card">
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-scan" className="text-base">Automatic Scanning</Label>
              <p className="text-sm text-gray-400 mt-1">
                Run security scans automatically at scheduled intervals
              </p>
            </div>
            <Switch 
              id="auto-scan"
              checked={autoScan}
              onCheckedChange={setAutoScan}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="data-sharing" className="text-base">Data Sharing</Label>
              <p className="text-sm text-gray-400 mt-1">
                Share anonymous threat data to improve detection systems
              </p>
            </div>
            <Switch 
              id="data-sharing"
              checked={dataSharing}
              onCheckedChange={setDataSharing}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
