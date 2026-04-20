import React, { useState } from 'react';
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

  const handleLogin = async (e: React.FormEvent) => {
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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <Card className="w-full max-w-sm p-8 relative border-slate-800/80 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400 tracking-tight">FairCred AI</h1>
            <p className="text-slate-400 mt-2 text-[11px] font-bold uppercase tracking-widest">Authentication Protocol</p>
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
               placeholder="••••••••" 
               autoComplete="current-password"
               required 
            />
            
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-bold tracking-wide">
                ⚠️ {errorMsg}
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
