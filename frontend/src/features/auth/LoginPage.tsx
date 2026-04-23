import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await api.post('/login', {
        username,
        password,
      });

      if (response.data && response.data.token) {
        login(response.data.token, username);
        navigate('/risk');
      } else {
        setErrorMsg('Invalid authentication token received from identity provider.');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Handshake failed. Ensure local credentials match database expectations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 p-4">
      <Card className="relative w-full max-w-sm border-stone-200 p-8 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="relative z-10">
          <div className="mb-10 text-center">
            <h1 className="bg-gradient-to-r from-amber-700 to-stone-900 bg-clip-text text-3xl font-black tracking-tight text-transparent">
              FairCred AI
            </h1>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-stone-600">Authentication Protocol</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="System Identifier"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              required
            />
            <Input
              label="Access Credential"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              autoComplete="current-password"
              required
            />

            {errorMsg && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-xs font-bold tracking-wide text-red-700">
                Warning: {errorMsg}
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" isLoading={loading} className="w-full py-3.5">
                Execute Validation
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
