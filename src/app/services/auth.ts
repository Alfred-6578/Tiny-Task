import { browserLocalPersistence, createUserWithEmailAndPassword, sendEmailVerification, setPersistence, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import Cookies from 'js-cookie';

interface SignupProps {
    fullName: string,
    email: string,
    password: string
}

interface SigninProps {
  email: string;
  password: string;
}


function generateRandomUsername() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `user${randomNum}`;
}

// Helper to check if displayName exists
async function isDisplayNameTaken(displayName: string) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("displayName", "==", displayName));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

// Tries to generate a unique username up to 5 times
async function getUniqueUsername() {
  let attempts = 0;
  while (attempts < 5) {
    const name = generateRandomUsername();
    const taken = await isDisplayNameTaken(name);
    if (!taken) return name;
    attempts++;
  }
  throw new Error("Failed to generate unique display name. Try again.");
}


export const Signup = async ({ fullName, email, password }: SignupProps) => {
  try {
    // Set auth persistence and create user
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generate unique username
    const displayName = fullName;
    const username = await getUniqueUsername() 

    // ✅ Run these in parallel to save time
    const updateProfilePromise = updateProfile(user, { displayName });

    const userDocData = {
      email: user.email,
      displayName,
      fullName,
      username,
      role: "user",
      createdAt: new Date(),
      emailVerified: user.emailVerified
    };
    const setDocPromise = setDoc(doc(db, "users", user.uid), userDocData);

    const sendEmailPromise = sendEmailVerification(user);

    // Await all at once
    await Promise.all([updateProfilePromise, setDocPromise, sendEmailPromise]);

    // ✅ Optionally fetch user doc and set cookies
    const userDocSnap = await getDoc(doc(db, "users", user.uid));
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      Cookies.set("role", userData.role, { expires: 7 });
      Cookies.set("userId", user.uid, { expires: 7 });
       if (userData.username) {
        Cookies.set("username", userData.username, { expires: 7 });
      }else{
        Cookies.set("username", userData.displayName, { expires: 7 });

      };
    }

    console.log("✅ Signup success:", user.uid);
    return userCredential;
  } catch (error: any) {
    throw error;
  }
};



export const Signin = async ({ email, password }: SigninProps) => {
  try {
  
    // Set auth persistence
    await setPersistence(auth, browserLocalPersistence);

    // Sign in the user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user doc from Firestore
    const userDocSnap = await getDoc(doc(db, "users", user.uid));
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();

      console.log(userData);
      
      // Set cookies
      Cookies.set("role", userData.role, { expires: 7 });
      Cookies.set("userId", user.uid, { expires: 7 });
      if (userData.username) {
        Cookies.set("username", userData.username, { expires: 7 });
      }else{
        Cookies.set("username", userData.displayName, { expires: 7 });

      }

      console.log("✅ Signin success:", user.uid);
      return userCredential;
    } else {
      throw new Error("User record not found.");
    }
  } catch (error: any) {
    throw error;
  }
};
