import { useState } from "react";

export const useLoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);
      
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error.message);
      // Handle error appropriately, e.g., show a notification or alert
      alert("Login failed: " + error.message);
    }
  };

  return { formData, handleChange, handleSubmit };
};
