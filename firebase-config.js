// Firebase configuration for Aurelie Hotel
// These values are safe to expose in client-side code — they identify
// the project, they are not secret credentials.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBCeeGUdrrzYgHmG238JsPMndJsbxWRe5s",
  authDomain: "aurelie-hotel.firebaseapp.com",
  projectId: "aurelie-hotel",
  storageBucket: "aurelie-hotel.firebasestorage.app",
  messagingSenderId: "985532759703",
  appId: "1:985532759703:web:8bfcf65bb7d2b4b46533d2"
};

const app = initializeApp(firebaseConfig);

// Export these so other JS files (auth.js, booking.js, dashboard files)
// can import and use the same connected instances.
export const auth = getAuth(app);
export const db = getFirestore(app);