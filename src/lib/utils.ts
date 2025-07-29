import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // your Firestore init

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapAuthFirebaseError(code: string) {
  switch (code) {
    // Sign‑up
    case "auth/email-already-in-use":
      return "This email is already in use.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/missing-password":
      return "Please enter a password.";

    // Sign‑in
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/invalid-credential":
      return "Invalid credentials provided. Please try again.";

    // Password reset
    case "auth/missing-email":
      return "Please enter your email address.";
    // (invalid-email and user-not-found already covered)

    // Email‑verification / Action codes
    case "auth/expired-action-code":
      return "This link has expired. Please request a new one.";
    case "auth/invalid-action-code":
      return "This link is invalid. Please request a new one.";
    case "auth/user-token-expired":
      return "Session expired. Please sign in again.";

    // Rate limiting / network / internal
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    case "auth/internal-error":
      return "An internal error occurred. Please try again.";

    default:
      return "Something went wrong. Please try again.";
  }
}


export const isUsernameTaken = async (username: string): Promise<boolean> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("displayName", "==", username));
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
};


export const cleanData = (obj: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== '' && value !== null && value !== undefined
    )
  );
};
