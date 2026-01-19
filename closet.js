import { auth, db, storage } from "./firebase.js";
import { ref, uploadBytes, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { addDoc, collection } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.getElementById("uploadBtn").onclick = async () => {
  const user = auth.currentUser;
  const file = document.getElementById("image").files[0];

  const storageRef = ref(storage, `clothes/${user.uid}/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  await addDoc(collection(db, "clothes"), {
    uid: user.uid,
    image: url,
    color: [...color.selectedOptions].map(o => o.value),
    season: [...season.selectedOptions].map(o => o.value),
    occasion: [...occasion.selectedOptions].map(o => o.value),
    type: [...type.selectedOptions].map(o => o.value)
  });

  alert("Item uploaded!");
};