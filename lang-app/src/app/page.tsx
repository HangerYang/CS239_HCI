"use client"

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth";
import {collection, addDoc} from "firebase/firestore"
import { auth, db } from "../../server/firebase";
import { useRouter } from "next/navigation";

const languages = ["Japanese", "Spanish", "French", "Korean", "Mandarin", "German"];
const skillLevels = ["Heritage", "Beginner", "Intermediate", "Advanced", "Native"];

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState(languages[0]);
  const [skillLevel, setSkillLevel] = useState(skillLevels[0]);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAuth = async () => {
    try {
      setError("");
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/dashboard");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if(userCredential) {
          try{
        await addDoc(collection(db, "users"), {
          uid: userCredential.user.uid,
          username,
          email,
          language,
          skillLevel,
          createdAt: new Date()
        });
      } catch (err) {
        console.log("db failed to write")
        setError("DB failed to write")
      }
    }
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Authentication failed. Check your inputs.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-black to-gray-800 text-white">
      <div className="w-96 p-8 bg-black border border-gray-600 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? "Log In" : "Sign Up"}</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 bg-black border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 mb-3 bg-black border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label className="block text-sm mb-1">Language you want to learn:</label>
            <select
              className="w-full p-2 mb-3 bg-black border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>

            <label className="block text-sm mb-1">Current Skill Level:</label>
            <select
              className="w-full p-2 mb-3 bg-black border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
            >
              {skillLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </>
        )}

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 bg-black border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleAuth}
          className="w-full p-2 mt-4 bg-white text-black rounded hover:bg-gray-300 font-bold"
        >
          {isLogin ? "Log In" : "Sign Up"}
        </button>

        <p className="text-sm text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            className="underline cursor-pointer ml-1"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </span>
        </p>
      </div>
    </div>
  );
}
