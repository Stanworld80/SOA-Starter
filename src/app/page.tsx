'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {useEffect, useState} from 'react';
import Link from 'next/link';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <Card className="w-full max-w-md shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to SOA-Starter!</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Your Firebase, Next.js, and Shadcn UI starter.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <p>
            This is a starter application that provides a basic setup for Firebase authentication and
            profile management.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register">
              <Button  className="rounded-md ">
                Register
              </Button>
            </Link>
            <Link href="/login">
              <Button  className="rounded-md ">
                Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
