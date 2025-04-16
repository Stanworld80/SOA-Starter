'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {useEffect, useState} from 'react';
import {auth} from '@/lib/firebase';
import {useRouter} from 'next/navigation';
import {signOut} from 'firebase/auth';

export default function Home() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [aboutMe, setAboutMe] = useState<string>('This is a default about me section.'); // Example default text
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        // Redirect to login if the user is not authenticated
        router.push('/login');
      }
    });

    return () => unsubscribe(); // Cleanup the subscription
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login'); // Redirect to login page after signing out
    } catch (error: any) {
      console.error('Sign out failed:', error.message);
      // Optionally display an error message to the user
    }
  };

  if (!userEmail) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <Card className="w-full max-w-md shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">User Homepage</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Welcome, {userEmail}!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <p>
            <strong>Email:</strong> {userEmail}
          </p>
          <p>
            <strong>About Me:</strong> {aboutMe}
          </p>
          <Button onClick={handleSignOut} className="rounded-md">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
