"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import CourseCard from '@/components/course/CourseCard';
import { useTuthub } from '@/providers/TuthubProvider';
import { toast } from 'sonner';
import API_BASE_URL from '@/config';

const TeacherDetailPage = () => {
  const params = useParams();
  const username = params.id as string;
  const { authState } = useTuthub();
  
  const [teacher, setTeacher] = useState<any>(null);
  const [teacherCourses, setTeacherCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherData = async () => {
      setLoading(true);
      
      try {
        // Fetch teacher data using public endpoint with username
        const teacherResponse = await fetch(`${API_BASE_URL}/api/users/users/public/?username=${username}`);
        if (!teacherResponse.ok) {
          throw new Error('Failed to fetch teacher data');
        }
        const teacherData = await teacherResponse.json();
        // Since the response is an array, take the first item
        if (teacherData && teacherData.length > 0) {
          setTeacher(teacherData[0]);
        } else {
          throw new Error('Teacher not found');
        }
        
        // Fetch teacher's courses
        const coursesResponse = await fetch(`${API_BASE_URL}/api/courses/`, {
          headers: {
            'Authorization': authState.token ? `Bearer ${authState.token}` : '',
          }
        });
        
        if (!coursesResponse.ok) {
          throw new Error('Failed to fetch courses');
        }
        
        const coursesData = await coursesResponse.json();
        // Filter courses for this teacher using username
        const teacherCourses = coursesData.filter((course: any) => course.teacher === username);
        setTeacherCourses(teacherCourses);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
        toast.error('Failed to load teacher data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeacherData();
  }, [username, authState]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-muted/30 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Teacher Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The teacher you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/teachers">
              <FaArrowLeft className="mr-2" />
              Back to Teachers
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
            <Link href="/teachers" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <FaArrowLeft size={14} />
              Back to Teachers
            </Link>
          </Button>
        </div>

        {/* Teacher profile header */}
        <div className="bg-background p-8 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                  {teacher.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{teacher.username}</h1>
                  <div className="flex items-center gap-1 text-muted-foreground mt-1">
                    <span>Teacher</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">About</h2>
                <p className="text-muted-foreground">
                  {teacher.bio || 'This teacher has not added a bio yet.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded text-center">
                  <div className="font-semibold text-2xl text-foreground">{teacherCourses.length}</div>
                  <div className="text-muted-foreground">Courses</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher's courses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Courses by {teacher.username}</h2>
          
          {teacherCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teacherCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  teacher={{
                    id: teacher.username,
                    username: teacher.username,
                  }}
                  linktoplaylist={course.linktoplaylist}
                  onEnroll={() => {/* Would handle enrollment logic here */}}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No courses yet</h3>
              <p className="text-muted-foreground">
                This teacher hasn't published any courses yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailPage; 