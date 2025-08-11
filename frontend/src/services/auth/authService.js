export const login = async (username, password) => {
  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    return data; // Return user data or token as needed
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Propagate the error for handling in the component
  }
};

export const register = async (username, email, password, displayName) => {
  try {
    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        display_name: displayName,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return "User registered successfully!";
  } catch (error) {
    console.error("Registration error:", error);
    throw error; // Propagate the error for handling in the component
  }
};
