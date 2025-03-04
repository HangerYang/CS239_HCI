"use client"
import { useEffect, useState } from "react";
import { auth } from "../../../server/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login"); // Redirect if not logged in
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  return user ? (
    <div>
      <h1 className="text-xl font-semibold text-center mb-4">Welcome, {user.email}!</h1>
      <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={() => signOut(auth)}>Logout</button>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
