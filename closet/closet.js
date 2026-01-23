import { auth, db, storage } from "../firebase.js";
import { ref, uploadBytes, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { addDoc, collection } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const imageInput = document.getElementById("fileInput");
const colorSelect = document.getElementById("color");
const seasonSelect = document.getElementById("season");
const occasionSelect = document.getElementById("occasion");
const typeSelect = document.getElementById("category");
const styleSelect = document.getElementById("style");
const submitBtn = document.getElementById("submitBtn");

submitBtn.onclick = async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in first!");
    return;
  }

  const file = imageInput.files[0];
  if (!file) {
    alert("Please select an image!");
    return;
  }

  try {
    console.log("Logged in UID:", user.uid);
    console.log("Logged in Email:", user.email);
    const storageRef = ref(storage, `clothes/${user.uid}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "clothes"), {
      uid: user.uid,
      image: url,
      color: [...colorSelect.selectedOptions].map(o => o.value),
      season: [...seasonSelect.selectedOptions].map(o => o.value),
      occasion: [...occasionSelect.selectedOptions].map(o => o.value),
      type: [...typeSelect.selectedOptions].map(o => o.value),
      style: [...styleSelect.selectedOptions].map(o => o.value)
    });

    alert("Item uploaded!");
  } catch (error) {
    console.error("Upload failed:", error);
    alert("Upload failed. Try again.");
  }
};