import { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

export default function MfaVerification() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loginWithMfa } = useAuth();
  const location = useLocation();
  const history = useHistory();

  const mfaToken = location.state?.mfaToken;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!mfaToken) {
      setError('MFA token not found. Please try logging in again.');
      setLoading(false);
      return;
    }

    try {
      await loginWithMfa(mfaToken, token);
      history.push('/'); // Redirect to home on successful login
    } catch (err: any) {
      setError(err.message || 'Failed to verify MFA token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>MFA Verification</CardTitle>
          <CardDescription>Enter the token from your authenticator app to complete your login.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter MFA token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading || !token}>
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

