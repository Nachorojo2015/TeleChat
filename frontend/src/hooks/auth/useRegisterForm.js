import { useState } from "react";
import { isValidPassword } from "../../utils/isValidPassword.js";

export const useRegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullname: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const isValid = isValidPassword(formData.password);

    if (!isValid) {
      alert(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          display_name: formData.fullname,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      alert("User registered successfully!");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
};
