import { auth, db } from "../firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const seeMoreBtn = document.getElementById("seeMoreClothes");
const clothesGrid = document.getElementById("clothesGrid");

const pageSize = 4;
let allClothes = [];
let currentIndex = 0;

const emptyEmojis = ["👗", "👔", "👖", "👠"];

const renderPage = () => {
    clothesGrid.innerHTML = "";

    const pageItems = allClothes.slice(currentIndex, currentIndex + pageSize);

    for (let i = 0; i < pageSize; i += 1) {
        const item = pageItems[i];
        const card = document.createElement("div");
        card.className = "gallery-item";

        if (item && item.image) {
            const img = document.createElement("img");
            img.src = item.image;
            img.alt = item.name || "Clothing item";
            img.loading = "lazy";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            card.appendChild(img);
        } else {
            const empty = document.createElement("div");
            empty.className = "empty-item";
            empty.textContent = emptyEmojis[i % emptyEmojis.length];
            card.appendChild(empty);
        }

        clothesGrid.appendChild(card);
    }
};

const loadClothes = async (userId) => {
    const clothesRef = collection(db, "clothes");
    const q = query(clothesRef, where("uid", "==", userId));
    const snapshot = await getDocs(q);

    allClothes = snapshot.docs.map((doc) => doc.data());

    allClothes.sort((a, b) => {
        const aTime = a.createdAt?.seconds ? a.createdAt.seconds : 0;
        const bTime = b.createdAt?.seconds ? b.createdAt.seconds : 0;
        return bTime - aTime;
    });

    currentIndex = 0;
    renderPage();
};

seeMoreBtn.addEventListener("click", () => {
    if (allClothes.length === 0) {
        renderPage();
        return;
    }

    currentIndex += pageSize;
    if (currentIndex >= allClothes.length) {
        currentIndex = 0;
    }
    renderPage();
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadClothes(user.uid);
    } else {
        allClothes = [];
        currentIndex = 0;
        renderPage();
    }
});
