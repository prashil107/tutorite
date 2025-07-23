"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch, FaChalkboardTeacher, FaUser } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import API_BASE_URL from '@/config';
import { toast } from 'sonner';
import { useTuthub } from '@/providers/TuthubProvider';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [teacherCourses, setTeacherCourses] = useState<{[key: string]: number}>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { authState } = useTuthub();

  // Fetch teachers and their courses on component mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      // Fetch teachers
      const teachersResponse = await fetch(`${API_BASE_URL}/api/users/users/public/?role=teacher`);
      if (!teachersResponse.ok) {
        throw new Error('Failed to fetch teachers');
      }
      const teachersData = await teachersResponse.json();
      setTeachers(teachersData);

      // Fetch all courses
      const coursesResponse = await fetch(`${API_BASE_URL}/api/courses/`, {
        headers: {
          'Authorization': authState.token ? `Bearer ${authState.token}` : '',
        }
      });
      if (!coursesResponse.ok) {
        throw new Error('Failed to fetch courses');
      }
      const coursesData = await coursesResponse.json();

      // Count courses for each teacher
      const courseCounts: {[key: string]: number} = {};
      coursesData.forEach((course: any) => {
        if (course.teacher in courseCounts) {
          courseCounts[course.teacher]++;
        } else {
          courseCounts[course.teacher] = 1;
        }
      });
      setTeacherCourses(courseCounts);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      const filtered = teachers.filter(
        teacher => 
          teacher.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (teacher.bio && teacher.bio.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setTeachers(filtered);
    } else {
      // If search query is empty, fetch all teachers again
      fetchTeachers();
    }
  };

  // Reset search when component unmounts
  useEffect(() => {
    return () => {
      setSearchQuery('');
    };
  }, []);

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Teachers</h1>
          <p className="text-muted-foreground text-lg">
            Connect with experienced teachers who are passionate about helping you learn
          </p>
        </div>

        {/* Search section */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex max-w-lg">
            <div className="relative flex w-full">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search teachers by name or expertise..."
                className="w-full pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                className="ml-2"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Teachers grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading teachers...</p>
          </div>
        ) : teachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <Card key={teacher.username} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {teacher.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">
                        <Link 
                          href={`/teachers/${teacher.username}`}
                          className="hover:text-primary transition-colors"
                        >
                          {teacher.username}
                        </Link>
                      </CardTitle>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <FaChalkboardTeacher size={12} />
                        <span>Teacher</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {teacher.bio || 'No bio available'}
                  </p>
                  
                  <div className="mt-4 text-center">
                    <div className="bg-muted/30 p-2 rounded inline-block">
                      <div className="font-semibold text-foreground">
                        {teacherCourses[teacher.username] || 0}
                      </div>
                      <div className="text-muted-foreground">Courses</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/teachers/${teacher.username}`}>
                        <FaUser className="mr-2" />
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No teachers found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any teachers matching your search criteria.
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              fetchTeachers();
            }}>
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachersPage; 