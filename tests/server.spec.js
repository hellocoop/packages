

const { APIRequestContext } = require('playwright');

(async () => {
  // Create an instance of APIRequestContext
  const requestContext = await APIRequestContext.create();

  try {
    // Make an API request and get the response
    const response = await requestContext.get('http://localhost:8080/');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching JSON:', error);
  }

  // Clean up and close the request context
  await requestContext.dispose();
})();
