import React, { useContext, useState, useEffect } from "react";
import { swFirebase, swFirestore } from "../firebase";

interface Props {
  children: React.ReactNode;
}

const AuthContext = React.createContext({
  currentUser: { email: "", role: "", id: "" },
  signUp: (email: string, password: string, role: string) => {},
  login: (email: string, password: string) => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthPovider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = swFirebase.auth().onAuthStateChanged((user) => {
      if (user && user.uid) {
        swFirestore
          .collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            const user = doc.data();

            setCurrentUser(user);
          });
      } else {
        setCurrentUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signUp(email: string, password: string, role: string) {
    return swFirebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((createdUser) => {
        if (!createdUser.user) return;

        swFirestore
          .collection("users")
          .doc(createdUser.user.uid)
          .set({
            email,
            role,
            id: createdUser.user.uid,
          })
          .catch(function (error) {
            console.error("Error writing document: ", error);
          });
      })
      .catch((error) => {
        console.log("in catch", error);
      });
  }

  function login(email: string, password: string) {
    return swFirebase.auth().signInWithEmailAndPassword(email, password);
  }

  function logout(): Promise<void> {
    return swFirebase.auth().signOut();
  }

  const value = {
    currentUser,
    signUp,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
