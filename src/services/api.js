const BASE_URL = "https://dummyjson.com";

/* ==========================================================================
   USERS REST API (GET, POST, PUT, DELETE)
   ========================================================================== */

/**
 * GET Users list from DummyJSON API
 * @param {number} limit Number of records
 * @returns {Promise<Array>} List of mapped customer objects
 */
export async function fetchUsersFromAPI(limit = 30) {
  try {
    console.log(
      `[HTTP GET API Request] Fetching users from: ${BASE_URL}/users?limit=${limit}`,
    );
    const response = await fetch(`${BASE_URL}/users?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Users API GET status: ${response.status}`);
    }

    const data = await response.json();
    console.log("[HTTP GET API Response] Received users ", data);
    const apiUsers = data.users || [];

    return apiUsers.map((u) => ({
      id: `cust-${u.id}`,
      rawId: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      mobile: u.phone,
      address: `${u.address?.address || "123 Main St"}, ${u.address?.city || "San Francisco"}, ${u.address?.state || "CA"}`,
      licenseNumber: `DL-${u.ein || `2024-${100000 + u.id * 941}`}`,
      createdAt: u.birthDate || "2026-08-15",
    }));
  } catch (error) {
    console.error("[HTTP GET API Error] Failed to fetch users:", error);
    throw error;
  }
}

/**
 * GET Single User by ID from DummyJSON API
 * @param {string|number} userId User ID
 * @returns {Promise<Object>} Single user API response
 */
export async function fetchUserByIdFromAPI(userId) {
  try {
    const cleanId = String(userId).replace("cust-", "");
    const numericId = parseInt(cleanId, 10) || 1;
    console.log(
      `[HTTP GET API Request] Fetching single user #${numericId}: ${BASE_URL}/users/${numericId}`,
    );
    const response = await fetch(`${BASE_URL}/users/${numericId}`);
    if (!response.ok) {
      throw new Error(`User ID API GET status: ${response.status}`);
    }
    const data = await response.json();
    console.log("[HTTP GET API Response] Single user record:", data);
    return data;
  } catch (error) {
    console.error("[HTTP GET Single User Error]:", error);
    return null;
  }
}

/**
 * POST Add New User to DummyJSON API
 * @param {Object} customerData Customer payload
 * @returns {Promise<Object>} Added user API response
 */
export async function addUserToAPI(customerData) {
  try {
    const nameParts = (customerData.name || "").split(" ");
    const firstName = nameParts[0] || "New";
    const lastName = nameParts.slice(1).join(" ") || "Customer";

    const response = await fetch(`${BASE_URL}/users/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email: customerData.email,
        phone: customerData.mobile,
        address: { address: customerData.address, city: "San Francisco" },
        ein: customerData.licenseNumber,
      }),
    });

    if (!response.ok) {
      throw new Error(`Users API POST status: ${response.status}`);
    }

    const data = await response.json();
    console.log("HTTP POST User Success (Network Tab):", data);
    return data;
  } catch (error) {
    console.error("HTTP POST User Error:", error);
    return null;
  }
}

/**
 * PUT Update Existing User in DummyJSON API
 * @param {string|number} userId User ID
 * @param {Object} updatedFields Updated fields
 * @returns {Promise<Object>} Updated user API response
 */
export async function updateUserInAPI(userId, updatedFields) {
  try {
    const cleanId = String(userId).replace("cust-", "");
    const numericId = parseInt(cleanId, 10) || 1;

    const response = await fetch(`${BASE_URL}/users/${numericId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: updatedFields.email,
        phone: updatedFields.mobile,
        address: { address: updatedFields.address },
      }),
    });

    if (!response.ok) {
      throw new Error(`Users API PUT status: ${response.status}`);
    }

    const data = await response.json();
    console.log("HTTP PUT User Success (Network Tab):", data);
    return data;
  } catch (error) {
    console.error("HTTP PUT User Error:", error);
    return null;
  }
}

/**
 * DELETE User from DummyJSON API
 * @param {string|number} userId User ID
 * @returns {Promise<Object>} Deleted user API response
 */
export async function deleteUserFromAPI(userId) {
  try {
    const cleanId = String(userId).replace("cust-", "");
    const numericId = parseInt(cleanId, 10) || 1;

    const response = await fetch(`${BASE_URL}/users/${numericId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Users API DELETE status: ${response.status}`);
    }

    const data = await response.json();
    console.log("HTTP DELETE User Success (Network Tab):", data);
    return data;
  } catch (error) {
    console.error("HTTP DELETE User Error:", error);
    return null;
  }
}

/* ==========================================================================
   PRODUCTS / CARS REST API (GET, POST, PUT, DELETE)
   ========================================================================== */

/**
 * GET Vehicle products from DummyJSON API
 * @returns {Promise<Array>} Vehicles list
 */
export async function fetchCarsFromAPI() {
  try {
    console.log(
      `[HTTP GET API Request] Fetching vehicles from: ${BASE_URL}/products/category/vehicle`,
    );
    const response = await fetch(`${BASE_URL}/products/category/vehicle`);
    if (response.ok) {
      const data = await response.json();
      console.log(
        "[HTTP GET API Response] Received vehicles (visible in DevTools Network tab):",
        data,
      );
      if (data.products && data.products.length > 0) {
        return data.products;
      }
    }

    // Fallback to general products if category is empty
    console.log(
      `[HTTP GET Fallback API Request] Fetching products from: ${BASE_URL}/products?limit=10`,
    );
    const fallbackResponse = await fetch(`${BASE_URL}/products?limit=10`);
    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      console.log(
        "[HTTP GET Fallback Response] Received products (visible in DevTools Network tab):",
        fallbackData,
      );
      return fallbackData.products || [];
    }

    return [];
  } catch (error) {
    console.error("[HTTP GET Cars API Error]:", error);
    return [];
  }
}

/**
 * POST Add New Car to DummyJSON API
 * @param {Object} carData Car payload
 * @returns {Promise<Object>} Added car API response
 */
export async function addCarToAPI(carData) {
  try {
    const response = await fetch(`${BASE_URL}/products/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `${carData.brand} ${carData.model}`,
        price: carData.pricePerDay,
        brand: carData.brand,
        category: "vehicle",
      }),
    });

    if (!response.ok) {
      throw new Error(`Cars API POST status: ${response.status}`);
    }

    const data = await response.json();
    console.log("HTTP POST Car Success (Network Tab):", data);
    return data;
  } catch (error) {
    console.error("HTTP POST Car Error:", error);
    return null;
  }
}

/**
 * PUT Update Existing Car in DummyJSON API
 * @param {string|number} carId Car ID
 * @param {Object} updatedFields Updated car fields
 * @returns {Promise<Object>} Updated car API response
 */
export async function updateCarInAPI(carId, updatedFields) {
  try {
    const cleanId = String(carId).replace("car-", "");
    const numericId = parseInt(cleanId, 10) || 1;

    const response = await fetch(`${BASE_URL}/products/${numericId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `${updatedFields.brand || "Vehicle"} ${updatedFields.model || "Model"}`,
        price: updatedFields.pricePerDay,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cars API PUT status: ${response.status}`);
    }

    const data = await response.json();
    console.log("HTTP PUT Car Success (Network Tab):", data);
    return data;
  } catch (error) {
    console.error("HTTP PUT Car Error:", error);
    return null;
  }
}

/**
 * DELETE Car from DummyJSON API
 * @param {string|number} carId Car ID
 * @returns {Promise<Object>} Deleted car API response
 */
export async function deleteCarFromAPI(carId) {
  try {
    const cleanId = String(carId).replace("car-", "");
    const numericId = parseInt(cleanId, 10) || 1;

    const response = await fetch(`${BASE_URL}/products/${numericId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Cars API DELETE status: ${response.status}`);
    }

    const data = await response.json();
    console.log("HTTP DELETE Car Success (Network Tab):", data);
    return data;
  } catch (error) {
    console.error("HTTP DELETE Car Error:", error);
    return null;
  }
}
