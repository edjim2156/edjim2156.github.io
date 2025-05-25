require('dotenv').config({ path: './.env' });
const express = require('express');
const path = require('path');
const axios = require('axios');
const NodeCache = require('node-cache');
const app = express();

// Configuration
const API_CACHE = new NodeCache({ stdTTL: 300 }); // 5 minute cache
const EBAY_API_CONFIG = {
    baseUrl: 'https://svcs.ebay.com/services/search/FindingService/v1',
    headers: {
        'X-EBAY-SOA-SECURITY-APPNAME': process.env.EBAY_APP_ID,
        'Content-Type': 'application/json'
    },
    defaultParams: {
        'SERVICE-VERSION': '1.13.0',
        'RESPONSE-DATA-FORMAT': 'JSON',
        'GLOBAL-ID': 'EBAY-US',
        'paginationInput.entriesPerPage': '5',
        'outputSelector': 'PictureURLLarge'
    }
};

// Middleware
app.use(express.static(path.join(__dirname, '../')));
app.use(express.json());

// Enhanced eBay API caller with rate limiting
async function callEbayApi(operation, params = {}) {
    const cacheKey = `${operation}_${JSON.stringify(params)}`;
    const cached = API_CACHE.get(cacheKey);
    if (cached) return cached;

    try {
        const response = await axios.get(EBAY_API_CONFIG.baseUrl, {
            params: {
                ...EBAY_API_CONFIG.defaultParams,
                'OPERATION-NAME': operation,
                ...params
            },
            headers: EBAY_API_CONFIG.headers,
            timeout: 10000
        });

        API_CACHE.set(cacheKey, response.data);
        return response.data;

    } catch (error) {
        if (error.response?.status === 500 && 
            error.response.data?.errorMessage?.[0]?.error?.[0]?.errorId === '10001') {
            console.log('Rate limit hit - implementing backoff');
            await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay
            return callEbayApi(operation, params); // Retry
        }
        throw error;
    }
}

// API endpoint
app.get('/api/listings', async (req, res) => {
    try {
        // 1. Verify seller exists
        try {
            await axios.get('https://api.ebay.com/ws/api.dll', {
                headers: {
                    'X-EBAY-API-CALL-NAME': 'GetUser',
                    'X-EBAY-API-APP-NAME': process.env.EBAY_APP_ID,
                    'X-EBAY-API-SITEID': '0'
                },
                params: { UserId: 'edjim_9632' }
            });
        } catch (error) {
            return res.status(404).json({
                status: 'error',
                message: 'Seller verification failed',
                details: error.response?.data?.errorMessage?.[0]?.error?.[0]?.message
            });
        }

        // 2. Fetch listings with proper filters
        const data = await callEbayApi('findItemsAdvanced', {
            'itemFilter(0).name': 'Seller',
            'itemFilter(0).value': 'edjim_9632',
            'itemFilter(1).name': 'HideDuplicateItems',
            'itemFilter(1).value': 'true'
        });

        // 3. Process response
        const items = data.findItemsAdvancedResponse?.[0]?.searchResult?.[0]?.item || [];
        
        if (items.length === 0) {
            return res.json({
                status: 'success',
                message: 'No active listings found',
                items: []
            });
        }

        // 4. Format response
        const formattedItems = items.map(item => ({
            id: item.itemId?.[0],
            title: item.title?.[0],
            price: item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__,
            image: item.pictureURLLarge?.[0] || item.galleryURL?.[0],
            url: item.viewItemURL?.[0],
            condition: item.condition?.[0]?.conditionDisplayName?.[0]
        }));

        res.json({
            status: 'success',
            count: formattedItems.length,
            items: formattedItems
        });

    } catch (error) {
        console.error('Final Error:', {
            message: error.message,
            errorId: error.response?.data?.errorMessage?.[0]?.error?.[0]?.errorId,
            details: error.response?.data
        });

        res.status(500).json({
            status: 'error',
            message: 'API request failed',
            details: error.response?.data?.errorMessage?.[0]?.error?.[0]?.message || 
                   error.message,
            suggestion: getSuggestion(error)
        });
    }
});

function getSuggestion(error) {
    const ebayError = error.response?.data?.errorMessage?.[0]?.error?.[0];
    if (!ebayError) return 'Check your API configuration';
    
    switch(ebayError.errorId) {
        case '1001': return 'Invalid eBay App ID';
        case '10001': return 'Rate limit exceeded - try again later';
        case '2000': return 'API call limit reached';
        default: return 'Check eBay API status';
    }
}

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Production Key: ${process.env.EBAY_APP_ID ? 'Loaded' : 'Missing'}`);
});