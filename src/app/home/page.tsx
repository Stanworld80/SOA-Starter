'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {useEffect, useState} from 'react';
import {auth} from '@/lib/firebase';
import {useRouter} from 'next/navigation';
import {signOut} from 'firebase/auth';
import {Textarea} from '@/components/ui/textarea';

export default function Home() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [aboutMe, setAboutMe] = useState<string>('This is a default about me section.'); // Example default text
  const [isEditing, setIsEditing] = useState(false);
  const [tempAboutMe, setTempAboutMe] = useState(aboutMe);
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

  const handleEdit = () => {
    setIsEditing(true);
    setTempAboutMe(aboutMe); // Initialize tempAboutMe with the current aboutMe
  };

  const handleSave = () => {
    setAboutMe(tempAboutMe); // Save the temporary aboutMe to the actual aboutMe
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempAboutMe(aboutMe); // Reset tempAboutMe to the current aboutMe
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
          <div>
            <strong>About Me:</strong>
            {isEditing ? (
              <Textarea
                value={tempAboutMe}
                onChange={(e) => setTempAboutMe(e.target.value)}
                className="mb-2"
              />
            ) : (
              <p>{aboutMe}</p>
            )}
          </div>

          {isEditing ? (
            <div className="flex justify-between">
              <Button onClick={handleSave} className="rounded-md">
                Save
              </Button>
              <Button type="button" variant="outline" className="rounded-md" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={handleEdit} className="rounded-md">
              Edit About Me
            </Button>
          )}
          <Button onClick={handleSignOut} className="rounded-md">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
