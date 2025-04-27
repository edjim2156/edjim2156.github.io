// Your eBay App ID and Seller's Username
const apiKey = ''; // Replace with your actual eBay App ID
const sellerUsername = 'edjim_9632'; // Replace with the actual seller username

// eBay Finding API URL to fetch listings from the seller
const url = `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsBySeller&SERVICE-VERSION=1.13.0&SECURITY-APPNAME=${apiKey}&GLOBAL-ID=EBAY-US&seller=${sellerUsername}&paginationInput.entriesPerPage=5&outputSelector=PictureURLLarge`;

fetch(url)
  .then((response) => response.json()) // Convert the response to JSON
  .then((data) => {
    const galleryContainer = document.getElementById('gallery-container'); // Get the container where we will place the listings
    
    // Check if listings are available
    if (data.findItemsBySellerResponse) {
      const items = data.findItemsBySellerResponse[0].searchResult[0].item; // Extract items from the response

      // Loop through each item and display it in the gallery
      items.forEach((item) => {
        const productDiv = document.createElement('div'); // Create a new div for each product
        productDiv.classList.add('product'); // Add a class for styling

        const figure = document.createElement('figure'); // Create figure tag to hold image
        const img = document.createElement('img'); // Create an image element
        img.src = item.pictureURL[0]; // Set image source
        img.alt = item.title; // Set image alt text
        figure.appendChild(img); // Append image to figure

        // Create a paragraph with the product's title, price, and link
        const p = document.createElement('p');
        p.innerHTML = `${item.title} - $${item.sellingStatus[0].currentPrice[0].__value__}<br><a href="${item.viewItemURL[0]}" target="_blank">View on eBay</a>`;
        
        // Append the figure and paragraph to the productDiv
        productDiv.appendChild(figure);
        productDiv.appendChild(p);
        
        // Append the productDiv to the galleryContainer
        galleryContainer.appendChild(productDiv);
      });
    }
  })
  .catch((error) => {
    // Handle any errors that occur during the fetch
    console.error('Error fetching data:', error);
  });
