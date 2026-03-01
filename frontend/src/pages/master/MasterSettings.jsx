import { useState } from 'react';

const MasterSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const userName = localStorage.getItem('userName') || 'Admin';
  const userEmail = 'admin@example.com'; // TODO: Get from context/API

  const [profileData, setProfileData] = useState({
    name: userName,
    email: userEmail,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement profile update API call
    console.log('Update profile:', profileData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement password change API call
    console.log('Change password');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔐' },
    { id: 'system', label: 'System', icon: '⚙️' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and system preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Profile Information</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <span className="text-2xl">ℹ️</span>
                <p className="text-sm text-muted-foreground">
                  Changing your email will require verification before taking effect.
                </p>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-foreground mb-2">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-2">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Must be at least 6 characters long
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Two Factor Authentication */}
          <div className="bg-card border border-border rounded-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground mb-2">Two-Factor Authentication</h2>
            <p className="text-muted-foreground mb-6">
              Add an extra layer of security to your account
            </p>
            <button className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors font-medium">
              Enable 2FA (Coming Soon)
            </button>
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">System Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">System Version</span>
                <span className="font-medium text-foreground">1.0.0</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Total Shops</span>
                <span className="font-medium text-foreground">24</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Total Admins</span>
                <span className="font-medium text-foreground">8</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Database Status</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="font-medium text-green-600 dark:text-green-400">Connected</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground mb-2">Database Backup</h2>
            <p className="text-muted-foreground mb-6">
              Create a backup of your system data
            </p>
            <button className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors font-medium">
              Create Backup (Coming Soon)
            </button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-destructive mb-2">Danger Zone</h2>
            <p className="text-muted-foreground mb-6">
              Irreversible actions that affect the entire system
            </p>
            <button className="px-6 py-2.5 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity font-medium">
              Clear All Data (Coming Soon)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterSettings;
