'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useState, useEffect} from 'react';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '@/lib/firebase';
import {useRouter} from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);

  useEffect(() => {
    const checkFirebaseInitialization = async () => {
      try {
        if (auth) {
          setIsFirebaseInitialized(true);
        } else {
          console.error('Firebase initialization failed.');
          setError('Firebase initialization failed. Please check your configuration.');
          setIsFirebaseInitialized(false);
        }
      } catch (e) {
        console.error('Error during Firebase initialization check:', e);
        setError('Error checking Firebase initialization. Please try again.');
        setIsFirebaseInitialized(false);
      }
    };

    checkFirebaseInitialization();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFirebaseInitialized) {
      setError('Firebase not initialized. Please try again.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in with:', email);
      router.push('/home'); // Redirect to the user's homepage after login
    } catch (err: any) {
      setError(err.message);
      console.error('Login failed:', err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <Card className="w-full max-w-md shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enter your credentials to login
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="rounded-md" disabled={!isFirebaseInitialized}>
              Login
            </Button>
            {!isFirebaseInitialized && (
              <p className="text-red-500">Firebase is not initialized. Please wait...</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
