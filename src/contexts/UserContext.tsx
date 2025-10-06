import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

interface UserDoc {
  name: string;
  email: string;
  role: string;
}

const UserContext = createContext<UserDoc | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);

  useEffect(() => {
    const auth = getAuth();
    let unsubUser: (() => void) | null = null;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (unsubUser) unsubUser();
      if (user) {
        const ref = doc(db, "users", user.uid);
        unsubUser = onSnapshot(ref, (docSnap) => {
          setUserDoc(docSnap.exists() ? (docSnap.data() as UserDoc) : null);
        });
      } else {
        setUserDoc(null);
      }
    });
    return () => {
      unsubAuth();
      if (unsubUser) unsubUser();
    };
  }, []);

  return (
    <UserContext.Provider value={userDoc}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
