async function fetchListings() {
    try {
        const response = await fetch('/api/listings');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const items = await response.json();
        const container = document.getElementById('listings');
        
        container.innerHTML = items.length ? 
            items.map(item => `
                <div class="listing">
                    <a href="${item.viewItemURL}" target="_blank">
                        <img src="${item.pictureURLLarge}" alt="${item.title}">
                        <h3>${item.title}</h3>
                        <p>$${item.sellingStatus.currentPrice.value}</p>
                    </a>
                </div>
            `).join('') : 
            '<p>No listings found</p>';
    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('listings').innerHTML = `
            <div class="error">
                Failed to load listings: ${error.message}
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', fetchListings);