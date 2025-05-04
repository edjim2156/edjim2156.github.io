document.addEventListener('DOMContentLoaded', () => {
  const imageData = [
    { src: "images/image3.png", caption: "Callaway XR Driver" },
    { src: "images/image4.png", caption: "Titleist AP2 Irons" },
    { src: "images/image5.png", caption: "Ping G410 Hybrid" },
    { src: "images/image6.png", caption: "TaylorMade Spider Putter" },
    { src: "images/image7.png", caption: "Cobra King Wedges" },
    { src: "images/image8.png", caption: "Mizuno JPX900 Fairway Wood" }
  ];

  let currentIndex = 0;

  // Main gallery elements
  const mainImage = document.getElementById('main-gallery-image');
  const mainCaption = document.getElementById('main-caption');
  const galleryLeft = document.getElementById('gallery-arrow-left');
  const galleryRight = document.getElementById('gallery-arrow-right');

  // Modal elements
  const modal = document.getElementById('slideshowModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modal-caption');
  const modalClose = document.querySelector('.close');
  const modalLeft = document.getElementById('arrow-left');
  const modalRight = document.getElementById('arrow-right');

  function updateMainImage() {
    const { src, caption } = imageData[currentIndex];
    mainImage.src = src;
    mainCaption.textContent = caption;
  }

  function updateModal() {
    const { src, caption } = imageData[currentIndex];
    modalImg.src = src;
    modalCaption.textContent = caption;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % imageData.length;
    updateMainImage();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + imageData.length) % imageData.length;
    updateMainImage();
  }

  // Initial load
  updateMainImage();

  // Gallery arrows
  galleryRight.addEventListener('click', () => {
    showNext();
  });

  galleryLeft.addEventListener('click', () => {
    showPrev();
  });

  // Open modal
  mainImage.addEventListener('click', () => {
    modal.style.display = 'block';
    updateModal();
  });

  // Close modal
  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Modal navigation
  modalRight.addEventListener('click', () => {
    showNext();
    updateModal();
  });

  modalLeft.addEventListener('click', () => {
    showPrev();
    updateModal();
  });

  // Also allow clicking the modal image to go forward
  modalImg.addEventListener('click', () => {
    showNext();
    updateModal();
  });

  // Optional: Close modal on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});
