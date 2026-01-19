import { auth, db } from "./firebase.js";
import { collection, getDocs, query, where, doc, getDoc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.getElementById("generateBtn").onclick = async () => {
  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  const userData = (await getDoc(userRef)).data();

  const now = Date.now();
  if (userData.outfitCount >= 3 && now - userData.lastGenerated < 172800000) {
    alert("Wait 48 hours for a free outfit");
    return;
  }

  const q = query(collection(db, "clothes"), where("uid", "==", user.uid));
  const snap = await getDocs(q);

  let tops=[], bottoms=[], shoes=[];
  snap.forEach(d => {
    const item = d.data();
    if (item.type.includes("Top")) tops.push(item);
    if (item.type.includes("Bottom")) bottoms.push(item);
    if (item.type.includes("Shoes")) shoes.push(item);
  });

  const outfitDiv = document.getElementById("outfit");
  outfitDiv.innerHTML = `
    <img src="${tops[0]?.image}">
    <img src="${bottoms[0]?.image}">
    <img src="${shoes[0]?.image}">
  `;

  await updateDoc(userRef, {
    outfitCount: userData.outfitCount + 1,
    lastGenerated: now
  });
};
