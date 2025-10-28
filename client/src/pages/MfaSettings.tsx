import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

export default function MfaSettings() {
  const { user } = useAuth();
  const [mfaEnabled, setMfaEnabled] = useState(user?.mfaEnabled || false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setMfaEnabled(user.mfaEnabled);
    }
  }, [user]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/mfa/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to generate MFA secret.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnable = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/mfa/enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (data.success) {
        setMfaEnabled(true);
        setQrCode(null);
        setSecret(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to enable MFA.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/mfa/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (data.success) {
        setMfaEnabled(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to disable MFA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Multi-Factor Authentication (MFA)</CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {mfaEnabled ? (
            <div>
              <p className="text-green-500 mb-4">MFA is currently enabled.</p>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter MFA token to disable"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
                <Button onClick={handleDisable} disabled={loading || !token}>
                  {loading ? 'Disabling...' : 'Disable MFA'}
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-4">MFA is currently disabled.</p>
              {!qrCode && (
                <Button onClick={handleGenerate} disabled={loading}>
                  {loading ? 'Generating...' : 'Setup MFA'}
                </Button>
              )}
              {qrCode && secret && (
                <div className="space-y-4">
                  <p>1. Scan this QR code with your authenticator app (e.g., Google Authenticator).</p>
                  <img src={qrCode} alt="MFA QR Code" className="mx-auto" />
                  <p>Or manually enter this secret: <code>{secret}</code></p>
                  <p>2. Enter the token from your app to enable MFA.</p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Enter MFA token"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                    />
                    <Button onClick={handleEnable} disabled={loading || !token}>
                      {loading ? 'Enabling...' : 'Enable MFA'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

