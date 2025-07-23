"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaUser, 
  FaBook, 
  FaChartLine, 
  FaEnvelope 
} from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTuthub } from '@/providers/TuthubProvider';
import { MockData } from '@/lib/api';
import API_BASE_URL from '@/config';

export default function TeacherDashboard() {
  const router = useRouter();
  const { authState } = useTuthub();
  interface Course {
    id: number;
    title: string;
    description: string;
    linktoplaylist?: string;
    teacher: number;
    students?: any[];
  }
  const [teacherCourses, setTeacherCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchTeacherCourses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/courses/`, {
          headers: {
            'Authorization': `Bearer ${authState.token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const courses = await response.json();
        setTeacherCourses(courses.filter((course: Course) => course.teacher === authState.user?.id));
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    if (authState.isAuthenticated && authState.user?.role === 'teacher') {
      fetchTeacherCourses();
    }
  }, [authState]);
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    // Redirect non-teachers away from this page
    if (!authState.isAuthenticated || authState.user?.role !== 'teacher') {
      router.push('/');
      return;
    }
  }, [authState, router]);

  // Function to handle course deletion
  const handleDeleteCourse = async (courseId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete course');
      }
      
      // Remove the course from state
      setTeacherCourses(prev => prev.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
      // Could add toast notification here
    }
  };

  // Handle tab navigation
  const handleTabChange = (tab: string) => {
    if (tab === 'students') {
      router.push('/dashboard/students');
      return;
    }
    if (tab === 'analytics') {
      router.push('/dashboard/analytics');
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Teacher Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage your courses, students, and profile
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1">Total Courses</p>
                <p className="text-3xl font-bold">{teacherCourses.length}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <FaBook className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1">Total Students</p>
                <p className="text-3xl font-bold">
                  {/* This would be a real count in an actual app */}
                  {teacherCourses.reduce((acc, course) => acc + (course.students?.length || 0), 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <FaUser className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          

        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="courses" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="students">My Students</TabsTrigger>

          </TabsList>
          
          {/* Courses Tab */}
          <TabsContent value="courses">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Courses</h2>
              <Button className="flex items-center gap-2" asChild>
                <Link href="/dashboard/create-course">
                  <FaPlus size={14} />
                  <span>Create New Course</span>
                </Link>
              </Button>
            </div>
            
            {teacherCourses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teacherCourses.map(course => (
                  <Card key={course.id}>
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                    </CardHeader>

                    {/* TODO: Add students count */}
                    {/* <CardContent>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Students: {course.students?.length || 0}</span>
                        <span>Created: {new Date().toLocaleDateString()}</span>
                      </div>
                    </CardContent> */}
                    <CardFooter className="flex justify-between">

                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/courses/${course.id}`}>View</Link>
                      </Button>
                      
                      
                      
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
                          <Link href={`/dashboard/edit-course/${course.id}`}>
                            <FaEdit size={12} />
                            <span>Edit</span>
                          </Link>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <FaTrash size={12} />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-muted/30">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-medium mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't created any courses yet. Get started by creating your first course.
                  </p>
                  <Button className="flex items-center gap-2" asChild>
                    <Link href="/dashboard/create-course">
                      <FaPlus size={14} />
                      <span>Create First Course</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Students Tab */}
          <TabsContent value="students">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">My Students</h2>
            </div>
            
            <Card className="bg-muted/30">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-medium mb-2">Student Management</h3>
                <p className="text-muted-foreground mb-4">
                  This section will show enrolled students across all your courses.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          

        </Tabs>
      </div>
    </div>
  );
} 