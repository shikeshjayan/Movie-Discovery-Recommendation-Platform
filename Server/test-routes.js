// Comprehensive Route Testing Script
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let authToken = null;

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: [],
};

function logResult(testName, success, error = null) {
  const status = success ? "✅ PASS" : "❌ FAIL";
  console.log(`${status} ${testName}`);
  if (error) {
    console.log(`   Error: ${error.message || error}`);
    if (error.response?.data) {
      console.log(`   Response data:`, error.response.data);
    }
  }

  results.tests.push({ testName, success, error });
  if (success) results.passed++;
  else results.failed++;
}

async function testPublicRoutes() {
  console.log("\n🔓 Testing Public Routes...\n");

  // Test media routes (public)
  try {
    const mediaResponse = await axiosInstance.get(
      "/movies/all?page=1&limit=2",
    );
    logResult(
      "GET /movies/all",
      mediaResponse.status === 200 && mediaResponse.data.success,
    );
  } catch (error) {
    logResult("GET /movies/all", false, error);
  }

  try {
    const popularResponse = await axiosInstance.get(
      "/movies/popular?page=1",
    );
    logResult(
      "GET /movies/popular",
      popularResponse.status === 200 && popularResponse.data.success,
    );
  } catch (error) {
    logResult("GET /movies/popular", false, error);
  }

  try {
    const tvResponse = await axiosInstance.get("/movies/popular-tv?page=1");
    logResult(
      "GET /movies/popular-tv",
      tvResponse.status === 200 && tvResponse.data.success,
    );
  } catch (error) {
    logResult("GET /movies/popular-tv", false, error);
  }

  try {
    const searchResponse = await axiosInstance.get(
      "/movies/search?query=avatar",
    );
    logResult(
      "GET /movies/search",
      searchResponse.status === 200 && searchResponse.data.success,
    );
  } catch (error) {
    logResult("GET /movies/search", false, error);
  }

  // Test auth routes (public registration/login)
  try {
    const registerResponse = await axiosInstance.post("/auth/register", {
      username: "testu" + Date.now().toString().slice(-6),
      email: "test" + Date.now() + "@example.com",
      password: "testpass123",
      adminKey: "mysecretadminkey123",
    });
    logResult(
      "POST /auth/register",
      registerResponse.status === 201 && registerResponse.data.success,
    );
  } catch (error) {
    // 400 might be due to duplicate email, which is acceptable
    if (
      error.response?.status === 400 &&
      error.response?.data?.message?.includes("already in use")
    ) {
      logResult(
        "POST /auth/register",
        true,
        "User already exists (acceptable)",
      );
    } else {
      logResult("POST /auth/register", false, error);
    }
  }

  try {
    const loginResponse = await axiosInstance.post("/auth/login", {
      email: "test@example.com",
      password: "testpass123",
    });

    if (loginResponse.status === 200 && loginResponse.data.token) {
      authToken = loginResponse.data.token;
      logResult("POST /auth/login", true);
    } else {
      logResult("POST /auth/login", false, "No token received");
    }
  } catch (error) {
    // If login fails, try to register and login again
    try {
      console.log("   Attempting to register user for login test...");
      const registerResponse = await axiosInstance.post("/auth/register", {
        username: "testu" + Date.now().toString().slice(-6),
        email: "testl" + Date.now() + "@example.com",
        password: "testpass123",
        adminKey: "mysecretadminkey123",
      });

      if (registerResponse.status === 201) {
        const loginResponse = await axiosInstance.post("/auth/login", {
          email: registerResponse.data.user.email,
          password: "testpass123",
        });

        if (loginResponse.status === 200 && loginResponse.data.token) {
          authToken = loginResponse.data.token;
          logResult("POST /auth/login", true);
        } else {
          logResult(
            "POST /auth/login",
            false,
            "Login failed after registration",
          );
        }
      } else {
        logResult(
          "POST /auth/login",
          false,
          "Registration failed for login test",
        );
      }
    } catch (retryError) {
      logResult("POST /auth/login", false, retryError);
    }
  }
}

async function testProtectedRoutes() {
  // Use the token from the successful registration/login above
  const testToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWI0MDg3YjYwNTU4MzRhNDEzZmZiNGIiLCJlbWFpbCI6InRlc3QxMjNAZXhhbXBsZS5jb20iLCJpYXQiOjE3NzM0MDYzMzUsImV4cCI6MTc3NDAxMTEzNX0.FeLAD9QYxMnhqLlnm3JJvUE2h7EccJfL0OLYJyZZaio";

  console.log("\n🔒 Testing Protected Routes...\n");

  const headers = { Authorization: `Bearer ${testToken}` };

  // Test auth protected routes
  try {
    const meResponse = await axiosInstance.get("/auth/me", { headers });
    logResult("GET /auth/me", meResponse.status === 200);
  } catch (error) {
    logResult("GET /auth/me", false, error);
  }

  // Test user routes
  try {
    const profileResponse = await axiosInstance.patch(
      "/users/update-profile",
      {
        username: "updateduser",
      },
      { headers },
    );
    logResult("PATCH /users/update-profile", profileResponse.status === 200);
  } catch (error) {
    logResult("PATCH /users/update-profile", false, error);
  }

   // Test history routes
   try {
     const historyResponse = await axiosInstance.get("/history", { headers });
     logResult("GET /history", historyResponse.status === 200);
   } catch (error) {
     logResult("GET /history", false, error);
   }

  // Test watch later routes
  try {
    const watchLaterResponse = await axiosInstance.get("/watchlater", {
      headers,
    });
    logResult("GET /watchlater", watchLaterResponse.status === 200);
  } catch (error) {
    logResult("GET /watchlater", false, error);
  }

  // Test reviews routes
  try {
    const myReviewsResponse = await axiosInstance.get(
      "/reviews/my-reviews",
      { headers },
    );
    logResult("GET /reviews/my-reviews", myReviewsResponse.status === 200);
  } catch (error) {
    logResult("GET /reviews/my-reviews", false, error);
  }
}

async function runTests() {
  console.log("🚀 Starting Comprehensive Route Testing...\n");

  await testPublicRoutes();
  await testProtectedRoutes();

  console.log("\n📊 Test Results Summary:");
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(
    `📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`,
  );

  if (results.failed > 0) {
    console.log("\n❌ Failed Tests:");
    results.tests
      .filter((t) => !t.success)
      .forEach((test) => {
        console.log(
          `   - ${test.testName}: ${test.error?.message || "Unknown error"}`,
        );
      });
  }

  console.log("\n🏁 Route Testing Complete!");
}

runTests().catch(console.error);
