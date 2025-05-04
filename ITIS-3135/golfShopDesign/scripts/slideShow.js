document.addEventListener('DOMContentLoaded', () => {
  const slideshowImages = [
    "images/background.jpg",
    "images/background1.png",
    "images/image1.png",
    ];
  
  let slideIndex = 0;
  const imgElement = document.querySelector('.images-column img');
  
  function showNextSlide() {
    imgElement.style.opacity = 0; // fade out
    
    setTimeout(() => {
      slideIndex++;
      if (slideIndex >= slideshowImages.length) {
        slideIndex = 0;
      }
      imgElement.src = slideshowImages[slideIndex];
      imgElement.style.opacity = 1; // fade in
    }, 500); // wait for fade-out before changing image
  }
  
  // Auto change every 5 seconds
  setInterval(showNextSlide, 5000);

  // On click
  imgElement.addEventListener('click', showNextSlide);
});
