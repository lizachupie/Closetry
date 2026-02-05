import { auth, db } from "../firebase.js";
import { collection, getDocs, query, where, doc, getDoc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const seasonSelect = document.getElementById("season");
const styleSelect = document.getElementById("style");
const occasionSelect = document.getElementById("occasion");
const generateBtn = document.getElementById("generateBtn");
const outfitGrid = document.getElementById("outfitGrid");

generateBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in first!");
    window.location.href = "../login/login.html";
    return;
  }

  const selectedSeason = seasonSelect.value;
  const selectedStyle = styleSelect.value;
  const selectedOccasion = occasionSelect.value;

  if (!selectedSeason || !selectedStyle || !selectedOccasion) {
    alert("Please select season, style, and occasion!");
    return;
  }

  try {
    generateBtn.disabled = true;
    generateBtn.textContent = "Generating...";

    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    const now = Date.now();
    if (userData.outfitCount >= 100 && now - userData.lastGenerated < 172800000) {
      alert("Wait 48 hours for a free outfit");
      generateBtn.disabled = false;
      generateBtn.textContent = "Generate Outfit";
      return;
    }

    const q = query(collection(db, "clothes"), where("uid", "==", user.uid));
    const snap = await getDocs(q);
    
    const allClothes = snap.docs.map(d => d.data());

    const matchingClothes = allClothes.filter(item => {
      const seasonMatch = item.season && item.season.includes(selectedSeason);
      const styleMatch = item.style && item.style.includes(selectedStyle);
      const occasionMatch = item.occasion && item.occasion.includes(selectedOccasion);
      return seasonMatch && styleMatch && occasionMatch;
    });

    if (matchingClothes.length === 0) {
      alert("No matching clothes found for the selected criteria!");
      generateBtn.disabled = false;
      generateBtn.textContent = "Generate Outfit";
      return;
    }

    const categories = {};
    matchingClothes.forEach(item => {
      const category = item.type;
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });

    const outfit = [];
    for (const category in categories) {
      const items = categories[category];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      outfit.push(randomItem);
    }

    outfitGrid.innerHTML = "";
    outfit.forEach(item => {
      const card = document.createElement("div");
      card.className = "outfit-item";
      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
      `;
      outfitGrid.appendChild(card);
    });

    await updateDoc(userRef, {
      outfitCount: userData.outfitCount + 1,
      lastGenerated: now
    });

    generateBtn.disabled = false;
    generateBtn.textContent = "Generate Outfit";
  } catch (error) {
    console.error("Outfit generation failed:", error);
    alert("Failed to generate outfit: " + error.message);
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate Outfit";
  }
});