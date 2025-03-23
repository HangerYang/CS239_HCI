"use client"
import { useEffect, useState } from "react";
import { auth } from "../../../server/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handlePractice = async () => {
    router.push("/");
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundImage: "url('/icons/background1.jpg')", backgroundSize: "cover" }}
    >
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        {user ? (
          <div className="p-8">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-[#48d1cc] rounded-full flex items-center justify-center mb-4 text-white text-3xl font-bold">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, {user.displayName || "User"}!
              </h1>
              <p className="text-gray-600 mt-1">{user.email}</p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="text-sm font-medium text-gray-500">USERNAME</h2>
                  <p className="text-gray-800 font-medium">{user.displayName || "Not set"}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full mt-6 bg-[#48d1cc] hover:bg-[#008080] text-white py-3 rounded-lg transition-colors duration-200 flex items-center justify-center font-medium"
              >
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>

              <button
                onClick={handlePractice}
                className="w-full mt-6 bg-[#48d1cc] hover:bg-[#008080] text-white py-3 rounded-lg transition-colors duration-200 flex items-center justify-center font-medium">
                <span className="text-l font-semi text-white">Start Practicing!</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#48d1cc]"></div>
          </div>
        )}
      </div>
    </div>
  );
}