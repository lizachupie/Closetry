document.getElementById('seeMoreClothes').addEventListener('click', () => {
    console.log('View all clothes');
});

document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        console.log('Gallery item clicked');
    });
});
