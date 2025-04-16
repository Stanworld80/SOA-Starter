'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {useEffect, useState} from 'react';
import {auth, db} from '@/lib/firebase';
import {useRouter} from 'next/navigation';
import {signOut} from 'firebase/auth';
import {Textarea} from '@/components/ui/textarea';
import {doc, getDoc, setDoc} from 'firebase/firestore';

export default function Home() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [aboutMe, setAboutMe] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempAboutMe, setTempAboutMe] = useState(aboutMe);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null); // State to store user ID

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserEmail(user.email);
        setUserId(user.uid); // Set user ID

        // Fetch user data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          // Set aboutMe from Firestore if it exists
          setAboutMe(docSnap.data().aboutMe || 'No about me yet.');
          setTempAboutMe(docSnap.data().aboutMe || 'No about me yet.');
        } else {
          // Create user document in Firestore if it doesn't exist
          await setDoc(userDocRef, {
            email: user.email,
            aboutMe: 'No about me yet.',
          });
          setAboutMe('No about me yet.');
          setTempAboutMe('No about me yet.');
        }
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
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempAboutMe(aboutMe); // Initialize tempAboutMe with the current aboutMe
  };

  const handleSave = async () => {
    if (!userId) return;

    // Update Firestore with the new aboutMe
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, { aboutMe: tempAboutMe }, { merge: true });

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
