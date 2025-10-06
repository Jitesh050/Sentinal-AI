
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Settings, 
  Shield, 
  BellRing, 
  Bot, 
  Server, 
  Eye, 
  Lock, 
  Save, 
  Plus,
  Moon,
  Sun
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("user");
  const { theme, toggleTheme } = useTheme();
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    pushNotifications: true,
    criticalOnly: false,
    dailySummary: true
  });
  
  const [scanProfiles, setScanProfiles] = useState([
    { id: 1, name: "Quick Scan", portRange: "1-1024", timeout: 30, depth: 3, useAuth: false },
    { id: 2, name: "Full Scan", portRange: "1-65535", timeout: 60, depth: 5, useAuth: true },
    { id: 3, name: "Custom", portRange: "80,443,8080,3306", timeout: 45, depth: 4, useAuth: true }
  ]);
  
  const [mlSettings, setMlSettings] = useState({
    detectionThreshold: 65,
    falsePositiveWeight: 35,
    anomalyThreshold: 70,
    minConfidence: 50
  });
  
  const saveProfile = (id: number) => {
    toast({
      title: "Profile Saved",
      description: `Scan profile ${id} has been updated.`
    });
  };
  
  const addNewProfile = () => {
    const newId = Math.max(...scanProfiles.map(profile => profile.id)) + 1;
    setScanProfiles([...scanProfiles, {
      id: newId,
      name: "New Profile",
      portRange: "1-1024",
      timeout: 30,
      depth: 3,
      useAuth: false
    }]);
  };
  
  const saveUserSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your user settings have been updated."
    });
  };
  
  const saveMlSettings = () => {
    toast({
      title: "ML Settings Updated",
      description: "Machine learning parameters have been adjusted."
    });
  };
  
  const handleThemeToggle = () => {
    toggleTheme();
    toast({
      title: "Theme Updated",
      description: `Switched to ${theme === 'dark' ? 'light' : 'dark'} theme.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings & Configuration</h1>
          <p className="text-sm text-gray-400 mt-1">
            Customize your security platform settings
          </p>
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="user" className="flex items-center gap-2">
            <User size={16} />
            <span className="hidden sm:inline">User Settings</span>
          </TabsTrigger>
          <TabsTrigger value="scanner" className="flex items-center gap-2">
            <Shield size={16} />
            <span className="hidden sm:inline">Scanner Config</span>
          </TabsTrigger>
          <TabsTrigger value="ml" className="flex items-center gap-2">
            <Bot size={16} />
            <span className="hidden sm:inline">ML Settings</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Server size={16} />
            <span className="hidden sm:inline">System Info</span>
          </TabsTrigger>
        </TabsList>
        
        {/* User Settings Tab */}
        <TabsContent value="user" className="space-y-6">
          <Card className="cyber-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-mono text-gray-300 flex items-center gap-2">
                <User size={18} className="text-cyber-blue" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input defaultValue="John Smith" className="cyber-input" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input defaultValue="john.smith@example.com" className="cyber-input" readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Job Role</Label>
                  <Input defaultValue="Security Analyst" className="cyber-input" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-mono text-gray-300 flex items-center gap-2">
                <Eye size={18} className="text-cyber-blue" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex gap-4">
                  <div 
                    className={`w-full p-4 border rounded-md cursor-pointer flex flex-col items-center space-y-2 ${theme === 'dark' ? 'border-cyber-blue bg-cyber-blue/10' : 'border-gray-700 bg-black/20'}`}
                    onClick={() => {
                      if (theme !== 'dark') toggleTheme();
                    }}
                  >
                    <div className="h-12 w-12 flex items-center justify-center bg-cyber-dark border border-cyber-blue/40 rounded-md">
                      <Moon size={20} className={theme === 'dark' ? 'text-cyber-blue' : 'text-gray-400'} />
                    </div>
                    <span className={theme === 'dark' ? 'text-cyber-blue' : 'text-gray-400'}>Dark</span>
                  </div>
                  
                  <div 
                    className={`w-full p-4 border rounded-md cursor-pointer flex flex-col items-center space-y-2 ${theme === 'light' ? 'border-cyber-blue bg-cyber-blue/10' : 'border-gray-700 bg-black/20'}`}
                    onClick={() => {
                      if (theme !== 'light') toggleTheme();
                    }}
                  >
                    <div className="h-12 w-12 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-md">
                      <Sun size={20} className={theme === 'light' ? 'text-cyber-blue' : 'text-gray-400'} />
                    </div>
                    <span className={theme === 'light' ? 'text-cyber-blue' : 'text-gray-400'}>Light</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <Label>Toggle Theme</Label>
                    <p className="text-xs text-gray-400">Switch between light and dark mode</p>
                  </div>
                  <Switch 
                    checked={theme === 'light'}
                    onCheckedChange={handleThemeToggle}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-mono text-gray-300 flex items-center gap-2">
                <Lock size={18} className="text-cyber-blue" />
                Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" className="cyber-input" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" className="cyber-input" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" className="cyber-input" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-mono text-gray-300 flex items-center gap-2">
                <BellRing size={18} className="text-cyber-blue" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Alerts</Label>
                    <p className="text-xs text-gray-400">Receive critical alerts via email</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailAlerts: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-xs text-gray-400">Receive alerts in your browser</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Critical Alerts Only</Label>
                    <p className="text-xs text-gray-400">Only receive high severity alerts</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.criticalOnly}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, criticalOnly: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Daily Summary</Label>
                    <p className="text-xs text-gray-400">Get a daily report of security events</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.dailySummary}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, dailySummary: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button className="bg-cyber-blue hover:bg-cyber-blue/90 text-black" onClick={saveUserSettings}>
              <Save size={16} className="mr-2" />
              Save Settings
            </Button>
          </div>
        </TabsContent>
        
        {/* Scanner Configuration Tab */}
        <TabsContent value="scanner" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-mono text-gray-300">Scan Profiles</h2>
            <Button variant="outline" size="sm" onClick={addNewProfile} className="gap-2">
              <Plus size={16} />
              Add Profile
            </Button>
          </div>
          
          {scanProfiles.map((profile) => (
            <Card key={profile.id} className="cyber-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-mono text-gray-300">{profile.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => saveProfile(profile.id)}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Profile Name</Label>
                    <Input 
                      value={profile.name}
                      className="cyber-input"
                      onChange={(e) => {
                        const updatedProfiles = scanProfiles.map(p => 
                          p.id === profile.id ? {...p, name: e.target.value} : p
                        );
                        setScanProfiles(updatedProfiles);
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Port Range</Label>
                    <Input 
                      value={profile.portRange}
                      className="cyber-input"
                      placeholder="e.g. 80,443,1-1024"
                      onChange={(e) => {
                        const updatedProfiles = scanProfiles.map(p => 
                          p.id === profile.id ? {...p, portRange: e.target.value} : p
                        );
                        setScanProfiles(updatedProfiles);
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Timeout (seconds)</Label>
                    <div className="flex items-center gap-4">
                      <Slider 
                        value={[profile.timeout]}
                        min={10}
                        max={120}
                        step={1}
                        onValueChange={(value) => {
                          const updatedProfiles = scanProfiles.map(p => 
                            p.id === profile.id ? {...p, timeout: value[0]} : p
                          );
                          setScanProfiles(updatedProfiles);
                        }}
                        className="flex-1"
                      />
                      <span className="w-12 text-right">{profile.timeout}s</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Scan Depth</Label>
                    <div className="flex items-center gap-4">
                      <Slider 
                        value={[profile.depth]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(value) => {
                          const updatedProfiles = scanProfiles.map(p => 
                            p.id === profile.id ? {...p, depth: value[0]} : p
                          );
                          setScanProfiles(updatedProfiles);
                        }}
                        className="flex-1"
                      />
                      <span className="w-12 text-right">{profile.depth}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Use Authentication</Label>
                      <p className="text-xs text-gray-400">Enable authenticated scanning</p>
                    </div>
                    <Switch 
                      checked={profile.useAuth}
                      onCheckedChange={(checked) => {
                        const updatedProfiles = scanProfiles.map(p => 
                          p.id === profile.id ? {...p, useAuth: checked} : p
                        );
                        setScanProfiles(updatedProfiles);
                      }}
                    />
                  </div>
                </div>
                
                {profile.useAuth && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-cyber-blue/20">
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input className="cyber-input" placeholder="Username" />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input type="password" className="cyber-input" placeholder="Password" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          <Card className="cyber-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-mono text-gray-300">Additional Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-fix Low Risk Issues</Label>
                  <p className="text-xs text-gray-400">Automatically apply fixes for low-severity issues</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Send Scan Notifications</Label>
                  <p className="text-xs text-gray-400">Notify when scans complete</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Save Scan History</Label>
                  <p className="text-xs text-gray-400">Keep detailed logs of all scans</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="space-y-2">
                <Label>Concurrent Scans</Label>
                <Select defaultValue="2">
                  <SelectTrigger className="cyber-input">
                    <SelectValue placeholder="Select maximum concurrent scans" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 scan</SelectItem>
                    <SelectItem value="2">2 scans</SelectItem>
                    <SelectItem value="3">3 scans</SelectItem>
                    <SelectItem value="5">5 scans</SelectItem>
                    <SelectItem value="10">10 scans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* ML Settings Tab */}
        <TabsContent value="ml" className="space-y-6">
          <Card className="cyber-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-mono text-gray-300 flex items-center gap-2">
                <Bot size={18} className="text-cyber-blue" />
                ML Detection Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Detection Threshold</Label>
                    <span className="text-sm text-gray-300">{mlSettings.detectionThreshold}%</span>
                  </div>
                  <Slider 
                    value={[mlSettings.detectionThreshold]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => {
                      setMlSettings({...mlSettings, detectionThreshold: value[0]});
                    }}
                  />
                  <p className="text-xs text-gray-400">Higher values reduce false positives but may miss some attacks</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>False Positive Weight</Label>
                    <span className="text-sm text-gray-300">{mlSettings.falsePositiveWeight}%</span>
                  </div>
                  <Slider 
                    value={[mlSettings.falsePositiveWeight]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => {
                      setMlSettings({...mlSettings, falsePositiveWeight: value[0]});
                    }}
                  />
                  <p className="text-xs text-gray-400">Higher values prioritize reducing false positives</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Anomaly Detection Threshold</Label>
                    <span className="text-sm text-gray-300">{mlSettings.anomalyThreshold}%</span>
                  </div>
                  <Slider 
                    value={[mlSettings.anomalyThreshold]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => {
                      setMlSettings({...mlSettings, anomalyThreshold: value[0]});
                    }}
                  />
                  <p className="text-xs text-gray-400">Threshold for detecting unusual patterns</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Minimum Confidence</Label>
                    <span className="text-sm text-gray-300">{mlSettings.minConfidence}%</span>
                  </div>
                  <Slider 
                    value={[mlSettings.minConfidence]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => {
                      setMlSettings({...mlSettings, minConfidence: value[0]});
                    }}
                  />
                  <p className="text-xs text-gray-400">Minimum confidence required to report a detection</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-cyber-blue/20">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatic ML Model Updates</Label>
                    <p className="text-xs text-gray-400">Keep ML models updated automatically</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="bg-cyber-blue hover:bg-cyber-blue/90 text-black" onClick={saveMlSettings}>
                  <Save size={16} className="mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* System Info Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card className="cyber-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-mono text-gray-300 flex items-center gap-2">
                <Settings size={18} className="text-cyber-blue" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Application</h3>
                    <p className="text-sm font-mono text-cyber-blue">SentinelAI v1.2.4</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">ML Model Version</h3>
                    <p className="text-sm font-mono text-cyber-blue">DetectionNet v3.2.1</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Database</h3>
                    <p className="text-sm font-mono text-cyber-blue">PostgreSQL 14.5</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Last Update</h3>
                    <p className="text-sm font-mono text-cyber-blue">2025-05-16 14:30:22</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">API Status</h3>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <p className="text-sm font-mono text-green-400">Online (200 OK)</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">ML Service</h3>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <p className="text-sm font-mono text-green-400">Running</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-cyber-blue/20 space-y-4">
                <h3 className="text-sm font-medium text-gray-300">System Health</h3>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">CPU Usage</span>
                      <span className="text-xs text-gray-400">32%</span>
                    </div>
                    <div className="h-2 bg-cyber-darker rounded-full">
                      <div className="h-2 bg-cyber-blue rounded-full w-[32%]"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Memory Usage</span>
                      <span className="text-xs text-gray-400">64%</span>
                    </div>
                    <div className="h-2 bg-cyber-darker rounded-full">
                      <div className="h-2 bg-cyber-orange rounded-full w-[64%]"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Disk Usage</span>
                      <span className="text-xs text-gray-400">47%</span>
                    </div>
                    <div className="h-2 bg-cyber-darker rounded-full">
                      <div className="h-2 bg-cyber-blue rounded-full w-[47%]"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Server size={14} className="text-cyber-blue" />
                  Check for Updates
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
