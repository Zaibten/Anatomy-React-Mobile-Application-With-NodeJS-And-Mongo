import ApiManager from "./ApiManager";

export const user_login = async (data) => {
  try {
    // Making POST request to the login API
    const result = await ApiManager.post("/user/login", data, {
      headers: {
        "content-type": "application/json", // Corrected content-type
      },
    });

    // Returning the result of the successful login
    return result.data; 
  } catch (error) {
    // Handling any errors and returning the error response
    if (error.response) {
      return error.response.data; // Return error message from server
    } else {
      return { error: "An unexpected error occurred." }; // In case of other errors
    }
  }
};
