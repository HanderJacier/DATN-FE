"use client";

import { ref, computed } from "vue";

const user = ref(null);
const isAuthenticated = ref(false);

export default function useAuth() {
  const loadUser = () => {
    try {
      const savedUser = localStorage.getItem("user");

      console.log("[v0] Loading user from localStorage:", {
        savedUser,
      });

      if (savedUser === "true") {
        const userData = JSON.parse(savedUser);
        user.value = userData;

        console.log("[v0] User successfully loaded:", userData);
      } else {
        user.value = null;

        console.log("[v0] No valid user data found in localStorage");
      }
    } catch (error) {
      console.error("[v0] Error loading user:", error);
      user.value = null;
    }
  };

  // Save user data to localStorage
  const saveUser = (userData) => {
    try {
      user.value = userData;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isAuthenticated", "true");
      console.log("[v0] User saved to localStorage:", userData);
    } catch (error) {
      console.error("[v0] Error saving user:", error);
    }
  };

  // Login function
  const login = (userData) => {
    saveUser(userData);
    setTimeout(() => {
      loadUser();
    }, 100);
    return true;
  };

  // Logout function
  const logout = () => {
    user.value = null;

    localStorage.removeItem("user");

    localStorage.removeItem("redirectAfterLogin");
    console.log("[v0] User logged out and localStorage cleared");
  };

  const refreshAuthState = () => {
    console.log("[v0] Force refreshing auth state...");
    loadUser();
    console.log("[v0] Current auth state:", {
      user: user.value,
    });
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!user.value) return false;
    return user.value.vaitro === role || user.value.role === role;
  };

  // Check if user is admin
  const isAdmin = computed(() => {
    return hasRole(1) || hasRole("admin");
  });

  // Get user info
  const getUserInfo = () => {
    return user.value;
  };

  loadUser();

  if (typeof window !== "undefined") {
    window.addEventListener("load", () => {
      setTimeout(loadUser, 100);
    });
  }

  return {
    user: computed(() => user.value),

    isAdmin,
    login,
    logout,
    hasRole,
    getUserInfo,
    loadUser,
    refreshAuthState, // Added for debugging
  };
}
