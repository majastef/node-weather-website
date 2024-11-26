const axios = require('axios') // Import axios

const apiKey = '521d989e31264e1f8b16b2eec1d961fa' // Replace with your OpenCage API key

// Function to get the city from latitude and longitude using OpenCage API
const getCityFromCoordinates = async (latitude, longitude) => {
    try {
        // Construct the OpenCage API URL
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

        // Get the response from the API
        const response = await axios.get(url);

        // Extract city or location from the response
        if (response.data.results.length > 0) {
            return response.data.results[0].components.city || 'City not found';
        } else {
            return 'City not found';
        }
    } catch (error) {
        console.error('Error fetching location:', error);
        return 'Error retrieving location';
    }
};

// Export the function so it can be used in other files
module.exports = getCityFromCoordinates;