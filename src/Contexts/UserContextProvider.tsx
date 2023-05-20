import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { createContext, useState, ReactNode, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import {
  collection,
  where,
  query,
  getDocs,
  addDoc,
  onSnapshot,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface UserContextProviderProps {
  children: ReactNode;
}

interface AuthUser {
  name?: string;
  email: string;
  password: string;
}

interface UserContextTypes {
  signInWithGoogle: () => void;
  signInWithUserEmailAndPassword: (user: AuthUser) => void;
  registerWithUserEmailAndPassword: (user: AuthUser) => void;
  signOutUser: () => void;
  userData: any;
  user: any;
}

export const UserContext = createContext<UserContextTypes | null>(
  {} as UserContextTypes
);

const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const collectionUserRef = collection(db, 'users');
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  const signInWithGoogle = async () => {
    try {
      const popup = await signInWithPopup(auth, provider);
      const user = popup.user;
      const q = query(collectionUserRef, where('uid', '==', user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collectionUserRef, {
          uid: user?.uid,
          name: user?.displayName,
          email: user?.email,
          image: user?.photoURL || userData?.image,
          authProvider: popup?.providerId,
        });
      }
    } catch (error: any) {
      console.error(error.message);
      const parts = error.message.split('/');
      const message = parts[1];
      toast.error(`(${message}`);
    }
  };

  const signInWithUserEmailAndPassword = async ({
    email,
    password,
  }: AuthUser) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error(error.message);
      const parts = error.message.split('/');
      const message = parts[1];
      toast.error(`(${message}`);
    }
  };

  const registerWithUserEmailAndPassword = async ({
    name,
    email,
    password,
  }: AuthUser) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collectionUserRef, {
        uid: user?.uid,
        name,
        providerId: 'email/password',
        email: user?.email,
      });
    } catch (error: any) {
      console.error(error.message);
      const parts = error.message.split('/');
      const message = parts[1];
      toast.error(`(${message}`);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error(error.message);
      const parts = error.message.split('/');
      const message = parts[1];
      toast.error(`(${message}`);
    }
  };

  const userStateChanged = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(collectionUserRef, where('uid', '==', user?.uid));
        await onSnapshot(q, (doc) => {
          setUserData(doc?.docs[0]?.data());
        });
        setUser(user);
      } else {
        setUser(null);
        navigate('/login');
      }
    });
  };

  useEffect(() => {
    userStateChanged();
    if (user || userData) {
      navigate('/');
    } else {
      navigate('/login');
    }
    return () => {
      userStateChanged();
    };
  }, []);

  const initialState: UserContextTypes = {
    signInWithGoogle,
    signInWithUserEmailAndPassword,
    registerWithUserEmailAndPassword,
    signOutUser,
    user,
    userData,
  };

  return (
    <UserContext.Provider value={initialState}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
