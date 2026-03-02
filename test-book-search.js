// Test script to debug Google Books API search
const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";

// Simulating the getGoogleBooksApiKey function
function getGoogleBooksApiKey() {
  const env = process.env;
  const key = env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY ?? env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY ?? "";
  console.log("API Key found:", key ? `${key.substring(0, 10)}...` : "NONE");
  return key;
}

async function testBookSearch(query, maxResults = 10) {
  if (!query.trim()) {
    console.log("Empty query");
    return [];
  }

  const params = new URLSearchParams({
    q: query,
    maxResults: String(maxResults),
    printType: "books",
  });
  
  const key = getGoogleBooksApiKey();
  if (key) {
    params.set("key", key);
  } else {
    console.log("WARNING: No API key set, using unauthenticated requests (limited quota)");
  }

  const url = `${GOOGLE_BOOKS_API_URL}?${params}`;
  console.log("\nFetching:", url.replace(/key=[^&]+/, 'key=***'));

  try {
    const response = await fetch(url);
    console.log("Response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", errorText);
      throw new Error(`Book search failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Total items:", data.totalItems);
    console.log("Items returned:", data.items ? data.items.length : 0);

    if (data.error) {
      console.log("API Error:", JSON.stringify(data.error, null, 2));
    }

    if (!data.items || data.items.length === 0) {
      console.log("No results found");
      return [];
    }

    console.log("\nFirst result:");
    const first = data.items[0];
    console.log("- ID:", first.id);
    console.log("- Title:", first.volumeInfo.title);
    console.log("- Authors:", first.volumeInfo.authors);
    
    return data.items;
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
}

// Test with API key
console.log("=== Test 1: With API key ===");
process.env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY = "AIzaSyBzEGK8IFGJwDue_eSnJUXF3_qkE3bGGc4";
testBookSearch("gatsby")
  .then(() => {
    console.log("\n=== Test 2: Without API key ===");
    delete process.env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY;
    delete process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    return testBookSearch("1984");
  })
  .then(() => console.log("\nAll tests passed!"))
  .catch(err => console.error("\nTest failed:", err));
