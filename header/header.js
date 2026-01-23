import { auth } from "../firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

if (window.history.length > 1) {
  document.getElementById("backBtn").style.display = "inline-block";
}

const logo = document.getElementById("logo");
const signOutBtn = document.getElementById("signOutBtn");

logo.addEventListener("click", () => {
  if (auth.currentUser) {
    window.parent.location.href = "../userpage/userpage.html";
  } else {
    window.parent.location.href = "../home/home.html";
  }
});

signOutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.parent.location.href = "../home/home.html";
  } catch (error) {
    console.error("Sign out failed:", error);
  }
});

auth.onAuthStateChanged((user) => {
  if (user) {
    signOutBtn.style.display = "inline";
  } else {
    signOutBtn.style.display = "none";
  }
});
