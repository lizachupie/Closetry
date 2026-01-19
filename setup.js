import { auth, db } from "./firebase.js";
import { doc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let selected = [];

document.querySelectorAll(".styles img").forEach(img => {
  img.onclick = () => {
    if (selected.includes(img.src)) {
      selected = selected.filter(i => i !== img.src);
      img.classList.remove("selected");
    } else if (selected.length < 5) {
      selected.push(img.src);
      img.classList.add("selected");
    }
  };
});

document.getElementById("saveBtn").onclick = async () => {
  const user = auth.currentUser;
  await updateDoc(doc(db, "users", user.uid), { likes: selected });
  window.location.href = "closet.html";
};
