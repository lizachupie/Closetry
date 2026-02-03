import { auth, db, storage } from "../firebase.js";
import { ref, uploadBytes, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { addDoc, collection } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const uploadArea = document.getElementById("uploadArea");
const imageInput = document.getElementById("fileInput");
const itemNameInput = document.getElementById("itemName");
const typeSelect = document.getElementById("category");
const submitBtn = document.getElementById("submitBtn");
const colorGroup = document.getElementById("colorGroup");
const seasonGroup = document.getElementById("seasonGroup");
const styleGroup = document.getElementById("styleGroup");
const occasionGroup = document.getElementById("occasionGroup");
const moodGroup = document.getElementById("moodGroup");
const colorSelected = document.getElementById("colorSelected");
const seasonSelected = document.getElementById("seasonSelected");
const styleSelected = document.getElementById("styleSelected");
const occasionSelected = document.getElementById("occasionSelected");
const moodSelected = document.getElementById("moodSelected");

const getCheckedValues = (group) =>
  [...group.querySelectorAll('input[type="checkbox"]:checked')].map((input) => input.value);

const updateSelectedText = (group, output) => {
  const values = getCheckedValues(group);
  output.textContent = values.length ? `Selected: ${values.join(", ")}` : "Selected: None";
};

uploadArea.addEventListener("click", () => {
  imageInput.click();
});

imageInput.addEventListener("change", () => {
  if (imageInput.files[0]) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
});

colorGroup.addEventListener("change", () => updateSelectedText(colorGroup, colorSelected));
seasonGroup.addEventListener("change", () => updateSelectedText(seasonGroup, seasonSelected));
styleGroup.addEventListener("change", () => updateSelectedText(styleGroup, styleSelected));
occasionGroup.addEventListener("change", () => updateSelectedText(occasionGroup, occasionSelected));
moodGroup.addEventListener("change", () => updateSelectedText(moodGroup, moodSelected));

updateSelectedText(colorGroup, colorSelected);
updateSelectedText(seasonGroup, seasonSelected);
updateSelectedText(styleGroup, styleSelected);
updateSelectedText(occasionGroup, occasionSelected);
updateSelectedText(moodGroup, moodSelected);

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in first!");
    window.location.href = "../login/login.html";
    return;
  }

  const file = imageInput.files[0];
  if (!file) {
    alert("Please select an image!");
    return;
  }

  const itemName = itemNameInput.value.trim();
  const colors = getCheckedValues(colorGroup);
  const seasons = getCheckedValues(seasonGroup);
  const styles = getCheckedValues(styleGroup);
  const occasions = getCheckedValues(occasionGroup);
  const moods = getCheckedValues(moodGroup);

  if (!itemName || !typeSelect.value || colors.length === 0 || seasons.length === 0 || styles.length === 0 || occasions.length === 0 || moods.length === 0) {
    alert("Please fill in all required fields!");
    return;
  }

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "Uploading...";
    
    console.log("Uploading for UID:", user.uid);
    const storageRef = ref(storage, `clothes/${user.uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "clothes"), {
      uid: user.uid,
      name: itemName,
      image: url,
      color: colors,
      season: seasons,
      occasion: occasions,
      type: typeSelect.value,
      style: styles,
      mood: moods,
      createdAt: new Date()
    });

    alert("Item added to your closet!");
    window.location.href = "../userpage/userpage.html";
  } catch (error) {
    console.error("Upload failed:", error);
    alert("Upload failed: " + error.message);
    submitBtn.disabled = false;
    submitBtn.textContent = "Add to Closet";
  }
});