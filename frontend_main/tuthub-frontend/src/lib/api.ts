import axios from 'axios';
import API_BASE_URL from '@/config';

// API base URL
const API_URL = `${API_BASE_URL}/api`;

// Define types for our API data
interface Course {
  id: number;
  title: string;
  description: string;
  teacher: number;
  linktoplaylist?: string;
  students?: any[];
}

// Course API
export const CourseAPI = {
  // Get all courses
  getAllCourses: async () => {
    try {
      const response = await axios.get(`${API_URL}/courses/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Get course by ID
  getCourseById: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/courses/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new course (teachers only)
  createCourse: async (courseData: {
    title: string;
    description: string;
    teacher: number;
    linktoplaylist: string;
  }) => {
    try {
      const response = await axios.post(`${API_URL}/courses/`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  // Update course (teachers only)
  updateCourse: async (id: number, courseData: {
    title?: string;
    description?: string;
    linktoplaylist?: string;
  }) => {
    try {
      const response = await axios.patch(`${API_URL}/courses/${id}/`, courseData);
      return response.data;
    } catch (error) {
      console.error(`Error updating course with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete course (teachers only)
  deleteCourse: async (id: number) => {
    try {
      await axios.delete(`${API_URL}/courses/${id}/`);
      return true;
    } catch (error) {
      console.error(`Error deleting course with ID ${id}:`, error);
      throw error;
    }
  },

  // Search courses - this would likely require a custom endpoint on the backend
  // This is a mock implementation
  searchCourses: async (query: string) => {
    try {
      const response = await axios.get(`${API_URL}/courses/`);
      const courses = response.data;
      
      // Filter courses based on query (client-side search as fallback)
      return courses.filter((course: Course) => 
        course.title.toLowerCase().includes(query.toLowerCase()) || 
        course.description.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching courses:', error);
      throw error;
    }
  }
};

// User API
export const UserAPI = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/users/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/users/users/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (id: number, userData: {
    username?: string;
    email?: string;
    bio?: string;
  }) => {
    try {
      const response = await axios.patch(`${API_URL}/users/users/${id}/`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  }
};

// Message API (placeholder for chat functionality)
export const MessageAPI = {
  // Get conversations for the current user
  getConversations: async () => {
    // This would need a custom endpoint in the backend
    // Mock implementation for now
    return [
      { id: 1, with: { id: 2, name: 'Jane Smith', role: 'teacher' }, lastMessage: 'Hello there!' },
      { id: 2, with: { id: 3, name: 'John Doe', role: 'student' }, lastMessage: 'Can you help me with the assignment?' }
    ];
  },

  // Get messages for a specific conversation
  getMessages: async () => {
    // This would need a custom endpoint in the backend
    // Mock implementation for now
    return [
      { id: 1, sender: 1, text: 'Hello, how can I help you?', timestamp: '2023-05-06T10:30:00Z' },
      { id: 2, sender: 2, text: 'I have a question about the course.', timestamp: '2023-05-06T10:32:00Z' },
      { id: 3, sender: 1, text: 'Sure, what would you like to know?', timestamp: '2023-05-06T10:33:00Z' }
    ];
  },

  // Send a message
  sendMessage: async (conversationId: number, text: string, senderId: number) => {
    // This would need a custom endpoint in the backend
    // Mock implementation for now
    return {
      id: Math.floor(Math.random() * 1000),
      sender: senderId,
      text,
      timestamp: new Date().toISOString()
    };
  }
};

// Mock data for initial development
export const MockData = {
  courses: [
    {
      id: 1,
      title: 'Introduction to Web Development',
      description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
      teacher: 1,
      linktoplaylist: 'https://www.youtube.com/playlist?list=abc123',
      students: []
    },
    {
      id: 2,
      title: 'Advanced React Techniques',
      description: 'Master React hooks, context API, and performance optimization.',
      teacher: 2,
      linktoplaylist: 'https://www.youtube.com/playlist?list=def456',
      students: []
    },
    {
      id: 3,
      title: 'Python for Data Science',
      description: 'Learn Python programming for data analysis and visualization.',
      teacher: 3,
      linktoplaylist: 'https://www.youtube.com/playlist?list=ghi789',
      students: []
    }
  ],
  users: [
    {
      id: 1,
      username: 'prof_smith',
      email: 'smith@example.com',
      role: 'teacher',
      bio: 'Web development instructor with 10+ years of experience.'
    },
    {
      id: 2,
      username: 'jane_doe',
      email: 'jane@example.com',
      role: 'teacher',
      bio: 'React specialist and frontend developer.'
    },
    {
      id: 3,
      username: 'data_guru',
      email: 'data@example.com',
      role: 'teacher',
      bio: 'Data scientist and Python expert.'
    },
    {
      id: 4,
      username: 'student1',
      email: 'student1@example.com',
      role: 'student',
      bio: 'Eager to learn web development.'
    }
  ]
}; 