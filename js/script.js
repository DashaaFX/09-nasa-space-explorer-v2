// Use this URL to fetch NASA APOD JSON data.
const apodData = 'https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json';

// Array of fun space facts
const spaceFacts = [
  "Did you know? A day on Venus is longer than its year!",
  "Did you know? Neutron stars can spin 600 times per second.",
  "Did you know? The largest volcano in the solar system is on Mars.",
  "Did you know? Jupiter has 95 known moons.",
  "Did you know? Light from the Sun takes about 8 minutes to reach Earth.",
  "Did you know? The Milky Way is estimated to have 100 billion planets.",
  "Did you know? Saturn could float in water because it's mostly gas.",
  "Did you know? The footprints on the Moon will remain for millions of years.",
  "Did you know? Space is completely silent.",
  "Did you know? There are more stars in the universe than grains of sand on Earth."
];

// Select DOM elements
const gallery = document.getElementById('gallery');
const getImageBtn = document.getElementById('getImageBtn');

// Create and show a random space fact
function showRandomFact() {
  // Pick a random fact from the array
  const fact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
  // Create a new div for the fact
  const factDiv = document.createElement('div');
  factDiv.className = 'space-fact';
  factDiv.textContent = fact;
  // Insert the fact above the gallery
  gallery.parentNode.insertBefore(factDiv, gallery);
}

// Show loading message
function showLoading() {
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🔄</div>
      <p>Loading space photos…</p>
    </div>
  `;
}

// Render the gallery with images and videos
function renderGallery(items) {
  // Clear the gallery
  gallery.innerHTML = '';
  // Loop through each item and create gallery cards
  items.forEach((item, idx) => {
    // Create the gallery item div
    const card = document.createElement('div');
    card.className = 'gallery-item';
    card.tabIndex = 0; // Make it focusable for accessibility

    // Check if the item is an image or video
    if (item.media_type === 'image') {
      // Create image element
      const img = document.createElement('img');
      img.src = item.url;
      img.alt = item.title;
      img.className = 'gallery-img';
      card.appendChild(img);
    } else if (item.media_type === 'video') {
      // For YouTube videos, show thumbnail and link
      let videoThumb = item.thumbnail_url || '';
      if (!videoThumb && item.url.includes('youtube.com')) {
        // Try to get YouTube thumbnail from video URL
        const videoId = item.url.split('v=')[1];
        if (videoId) {
          videoThumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      }
      if (videoThumb) {
        const img = document.createElement('img');
        img.src = videoThumb;
        img.alt = item.title + ' (Video)';
        img.className = 'gallery-img';
        card.appendChild(img);
      }
      // Add a play button overlay
      const playBtn = document.createElement('div');
      playBtn.className = 'play-btn';
      playBtn.textContent = '▶';
      card.appendChild(playBtn);
    }

    // Add title and date
    const title = document.createElement('p');
    title.innerHTML = `<strong>${item.title}</strong><br>${item.date}`;
    card.appendChild(title);

    // Add click event to open modal
    card.addEventListener('click', () => openModal(item));
    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') openModal(item);
    });

    gallery.appendChild(card);
  });
}

// Create and show the modal
function openModal(item) {
  // Create the modal overlay
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';

  // Create the modal content box
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  // Add a close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.textContent = '×';
  closeBtn.onclick = () => document.body.removeChild(modal);

  // Add the image or video
  let mediaElem;
  if (item.media_type === 'image') {
    // If it's an image, show the image
    mediaElem = document.createElement('img');
    mediaElem.src = item.url;
    mediaElem.alt = item.title;
    mediaElem.style.width = '100%';
    mediaElem.style.borderRadius = '8px';
  } else if (item.media_type === 'video') {
    // If it's a YouTube video, embed it
    if (item.url.includes('youtube.com')) {
      // Get the YouTube video ID from the URL
      const videoId = item.url.split('v=')[1];
      if (videoId) {
        mediaElem = document.createElement('iframe');
        mediaElem.width = '100%';
        mediaElem.height = '315';
        mediaElem.src = `https://www.youtube.com/embed/${videoId}`;
        mediaElem.frameBorder = '0';
        mediaElem.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        mediaElem.allowFullscreen = true;
      }
    }
    // If not YouTube, show a link to the video
    if (!mediaElem) {
      mediaElem = document.createElement('a');
      mediaElem.href = item.url;
      mediaElem.target = '_blank';
      mediaElem.textContent = 'Watch Video';
      mediaElem.style.display = 'block';
      mediaElem.style.fontSize = '20px';
      mediaElem.style.margin = '20px 0';
    }
  }

  // Add title, date, and explanation
  const info = document.createElement('div');
  info.innerHTML = `
    <h2>${item.title}</h2>
    <p><em>${item.date}</em></p>
    <p>${item.explanation}</p>
  `;

  // Put everything together
  modalContent.appendChild(closeBtn);
  if (mediaElem) modalContent.appendChild(mediaElem);
  modalContent.appendChild(info);
  modal.appendChild(modalContent);

  // Close modal when clicking outside the content
  modal.onclick = (e) => {
    if (e.target === modal) document.body.removeChild(modal);
  };

  document.body.appendChild(modal);
}

// Fetch data and show gallery
getImageBtn.addEventListener('click', () => {
  showLoading(); // Show loading message
  fetch(apodData)
    .then(response => response.json())
    .then(data => {
      renderGallery(data);
    })
    .catch(error => {
      gallery.innerHTML = `<div class="placeholder"><p>Sorry, could not load images.</p></div>`;
    });
});

// Show random fact on page load
showRandomFact();
