"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "@/config";

// Define types for our context
type User = {
  id: number;
  username: string;
  email: string;
  role: 'student' | 'teacher';
  bio?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

type TuthubContextType = {
  authState: AuthState;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string, role: 'student' | 'teacher') => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
};

// Create a context with a default value
const TuthubContext = createContext<TuthubContextType | undefined>(undefined);

// API base URL - would come from environment variable in production
const API_URL = `${API_BASE_URL}/api`;

export const TuthubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem("tuthub_token");
    const userData = localStorage.getItem("tuthub_user");
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        
        // Configure axios to use the token for subsequent requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/users/token/`, {
        username,
        password,
      });
      
      const { access, refresh } = response.data;
      
      // Get user data
      const userResponse = await axios.get(`${API_URL}/users/users/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      
      // Find the logged-in user
      const userData = userResponse.data.find((user: User) => user.username === username);
      
      if (!userData) {
        throw new Error("User data not found after login");
      }
      
      // Store auth data
      localStorage.setItem("tuthub_token", access);
      localStorage.setItem("tuthub_refresh", refresh);
      localStorage.setItem("tuthub_user", JSON.stringify(userData));
      
      // Update auth state
      setAuthState({
        user: userData,
        token: access,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Set default header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    // Remove auth data from storage
    localStorage.removeItem("tuthub_token");
    localStorage.removeItem("tuthub_refresh");
    localStorage.removeItem("tuthub_user");
    
    // Reset auth state
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    // Remove authorization header
    delete axios.defaults.headers.common["Authorization"];
  };

  // Register function
  const register = async (username: string, email: string, password: string, role: 'student' | 'teacher') => {
    try {
      const response = await axios.post(`${API_URL}/users/signup/`, {
        username,
        email,
        password,
        role,
      });
      
      const { access, refresh } = response.data;
      const userData = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role,
      };
      
      // Store auth data
      localStorage.setItem("tuthub_token", access);
      localStorage.setItem("tuthub_refresh", refresh);
      localStorage.setItem("tuthub_user", JSON.stringify(userData));
      
      // Update auth state
      setAuthState({
        user: userData,
        token: access,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Set default header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    if (!authState.user || !authState.token) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await axios.patch(
        `${API_URL}/users/users/${authState.user.username}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      const updatedUser = response.data;
      
      // Update local storage
      localStorage.setItem("tuthub_user", JSON.stringify(updatedUser));
      
      // Update auth state
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
      
      return updatedUser;
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  const contextValue: TuthubContextType = {
    authState,
    login,
    logout,
    register,
    updateProfile,
  };

  return (
    <TuthubContext.Provider value={contextValue}>
      {children}
    </TuthubContext.Provider>
  );
};

// Custom hook to use the Tuthub context
export const useTuthub = () => {
  const context = useContext(TuthubContext);
  if (context === undefined) {
    throw new Error("useTuthub must be used within a TuthubProvider");
  }
  return context;
}; 