// Aurelie Hotel — Authentication logic
// Handles sign up, login, logout, and writing/reading the user's role.

import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// ---------- SIGN UP ----------
// Creates the account, then creates a matching "users" document in
// Firestore with role: "guest" so we know how to treat them later.
export async function signUpGuest(fullName, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", cred.user.uid), {
    name: fullName,
    email: email,
    role: "guest",
    createdAt: serverTimestamp()
  });
  return cred.user;
}

// ---------- LOG IN ----------
export async function logIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// ---------- LOG OUT ----------
export async function logOut() {
  await signOut(auth);
  window.location.href = "login.html";
}

// ---------- GET A USER'S ROLE ----------
// Looks up the "role" field ("guest" or "admin") for the logged-in user.
export async function getUserRole(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data().role : null;
}

// ---------- ROUTE GUARDS ----------
// Call this at the top of a guest-only page (e.g. dashboard-guest.html).
// Redirects to login.html if nobody is signed in.
export function requireGuest(onReady) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
    } else {
      onReady(user);
    }
  });
}

// Call this at the top of dashboard-admin.html.
// Redirects away if nobody is signed in, or if the signed-in user is not an admin.
export function requireAdmin(onReady) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }
    const role = await getUserRole(user.uid);
    if (role !== "admin") {
      window.location.href = "index.html";
      return;
    }
    onReady(user);
  });
}