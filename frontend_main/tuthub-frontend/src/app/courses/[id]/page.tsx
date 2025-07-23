"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaYoutube, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { MockData } from '@/lib/api';
import { useTuthub } from '@/providers/TuthubProvider';
import { toast } from 'sonner';
import API_BASE_URL from '@/config';

const CourseDetailPage = () => {
  const params = useParams();
  const courseId = Number(params.id);
  const { authState } = useTuthub();
  
  const [course, setCourse] = useState<any>(null);
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  // Simulate fetching course details
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      
      try {
        // Fetch course data from the API
        const courseResponse = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
          headers: {
            'Authorization': authState.token ? `Bearer ${authState.token}` : '',
          }
        });
        
        if (!courseResponse.ok) {
          throw new Error('Failed to fetch course');
        }
        
        const courseData = await courseResponse.json();
        setCourse(courseData);
        
        // Fetch teacher data if needed
        if (courseData.teacher) {
          const teacherResponse = await fetch(`${API_BASE_URL}/api/users/${courseData.teacher}`, {
            headers: {
              'Authorization': authState.token ? `Bearer ${authState.token}` : '',
            }
          });
          
          if (teacherResponse.ok) {
            const teacherData = await teacherResponse.json();
            setTeacher(teacherData);
          }
        }
        
        // Check if user is enrolled
        if (authState.isAuthenticated && authState.user) {
          // You'll need to implement this endpoint on your backend
          const enrollmentResponse = await fetch(`${API_BASE_URL}/api/enrollments/check/?user=${authState.user.id}&course=${courseId}`, {
            headers: {
              'Authorization': `Bearer ${authState.token}`,
            }
          });
          
          if (enrollmentResponse.ok) {
            const enrollmentData = await enrollmentResponse.json();
            setEnrolled(enrollmentData.enrolled);
          }
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        // Let the error state be handled by the UI
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId, authState]);

  // Handle enrollment
  const handleEnroll = async () => {
    if (!authState.isAuthenticated) {
      toast.error('Please sign in to enroll in this course');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/enrollments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({
          user: authState.user?.id,
          course: courseId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to enroll');
      }
      
      setEnrolled(true);
      toast.success('Successfully enrolled in the course!');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to enroll in course');
    } finally {
      setLoading(false);
    }
  };

  // Handle sending a message to the teacher
  const handleContactTeacher = () => {
    if (!authState.isAuthenticated) {
      toast.error('Please sign in to contact the teacher');
      return;
    }

    // In a real app, this would navigate to the messages page with this teacher
    toast.success('Message feature would open here');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-muted/30 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/courses">
              <FaArrowLeft className="mr-2" />
              Back to Courses
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/courses" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <FaArrowLeft size={14} />
              Back to Courses
            </Link>
          </Button>
        </div>

        {/* Course header */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
            
            {/* Teacher info */}
            {teacher && (
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center text-primary font-semibold">
                  {teacher.username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <Link 
                    href={`/teachers/${teacher.id}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {teacher.username}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {teacher.role}
                  </p>
                </div>
              </div>
            )}

            {/* Course actions */}
            <div className="flex flex-wrap gap-3 mb-6">
              {enrolled ? (
                <div className="bg-primary/10 text-primary font-medium py-2 px-4 rounded-md flex items-center">
                  You are enrolled in this course
                </div>
              ) : (
                <Button 
                  onClick={handleEnroll} 
                  disabled={loading}
                  className="min-w-32"
                >
                  {loading ? 'Processing...' : 'Enroll Now'}
                </Button>
              )}
              {course.linktoplaylist && (
                <Button variant="outline" asChild>
                  <Link href={course.linktoplaylist} target="_blank" rel="noopener noreferrer">
                    <FaYoutube className="mr-2" />
                    Watch Playlist
                  </Link>
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={handleContactTeacher}
                disabled={!teacher}
              >
                <FaEnvelope className="mr-2" />
                Contact Teacher
              </Button>
            </div>
          </div>
        </div>

        {/* Course description */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">About This Course</h2>
              <div className="prose max-w-none">
                <p className="text-muted-foreground">{course.description}</p>
                
                {/* For demo purposes, adding more mock content */}
                <h3 className="text-xl font-semibold mt-6 mb-3">What You'll Learn</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Understand the core concepts of the subject</li>
                  <li>Apply theoretical knowledge to practical scenarios</li>
                  <li>Develop problem-solving skills through hands-on exercises</li>
                  <li>Build a portfolio of projects to showcase your skills</li>
                  <li>Prepare for advanced topics in the field</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Course Structure</h3>
                <p className="text-muted-foreground">
                  This course is structured as a series of video lectures, accompanied by resources 
                  and exercises to reinforce learning. You can watch the entire playlist at your own pace
                  and reach out to the teacher with any questions.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Teacher details */}
            {teacher && (
              <div className="bg-background p-6 rounded-lg shadow-sm mb-6">
                <h3 className="text-xl font-bold mb-4">About the Teacher</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center text-primary font-semibold text-lg">
                    {teacher.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <Link 
                      href={`/teachers/${teacher.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {teacher.username}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {teacher.role}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{teacher.bio}</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/teachers/${teacher.id}`}>
                    <FaUser className="mr-2" />
                    View Profile
                  </Link>
                </Button>
              </div>
            )}

            {/* Course info */}
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Course Information</h3>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium text-foreground">
                    {enrolled ? 'Enrolled' : 'Not Enrolled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="font-medium text-foreground">Video Tutorials</span>
                </div>
                <div className="flex justify-between">
                  <span>Playlist:</span>
                  <span className="font-medium text-foreground">
                    {course.linktoplaylist ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage; 