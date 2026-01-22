import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.getElementById("registerBtn").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", userCred.user.uid), {
      likes: [],
      outfitCount: 0,
      lastGenerated: 0
    });
    window.location.href = "userpage.html";
  } catch (error) {
    console.error("Registration failed:", error);
    alert("Registration failed: " + error.message);
  }
};

document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "userpage.html";
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed: " + error.message);
  }
};

document.getElementById("signOutBtn").onclick = async () => {
  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Sign out failed:", error);
    alert("Sign out failed: " + error.message);
  }
};