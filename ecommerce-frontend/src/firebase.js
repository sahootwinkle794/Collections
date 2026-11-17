import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyACA-Q8ETvfVeqdT27ZBJNBJlwNawOynNg",
  authDomain: "gnt-collections.firebaseapp.com",
  projectId: "gnt-collections",
  storageBucket: "gnt-collections.firebasestorage.app",
  messagingSenderId: "105458397718",
  appId: "1:105458397718:web:cd61bf74f9c623c058bb37",
  measurementId: "G-7WFXBSFKCG",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();