"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaEnvelope, FaUser, FaSearch } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MockData } from '@/lib/api';
import { useTuthub } from '@/providers/TuthubProvider';

type StudentWithCourses = {
  id: number;
  username: string;
  email?: string;
  enrolled: {
    courseId: number;
    courseName: string;
    enrollmentDate: string;
  }[];
};

export default function StudentsPage() {
  const router = useRouter();
  const { authState } = useTuthub();
  const [students, setStudents] = useState<StudentWithCourses[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect non-teachers away from this page
    if (!authState.isAuthenticated || authState.user?.role !== 'teacher') {
      router.push('/');
      return;
    }

    // Load teacher's courses and students (mock data)
    if (authState.user) {
      // Get courses for this teacher
      const teacherCourses = MockData.courses.filter(
        course => course.teacher === authState.user?.id
      );
      
      // Get students for these courses
      const studentMap = new Map<number, StudentWithCourses>();
      
      // Mock enrollment - in a real app, this would come from the API
      MockData.users
        .filter(user => user.role === 'student')
        .slice(0, 8) // Just take a few for mock data
        .forEach(student => {
          // Randomly assign courses to students
          const enrolledCourses = teacherCourses
            .filter(() => Math.random() > 0.5) // Randomly choose courses
            .map(course => ({
              courseId: course.id,
              courseName: course.title,
              enrollmentDate: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
            }));
            
          if (enrolledCourses.length > 0) {
            studentMap.set(student.id, {
              id: student.id,
              username: student.username,
              email: `${student.username.toLowerCase()}@example.com`,
              enrolled: enrolledCourses,
            });
          }
        });
        
      setStudents(Array.from(studentMap.values()));
      setIsLoading(false);
    }
  }, [authState, router]);

  // Filter students based on search query
  const filteredStudents = searchQuery.trim()
    ? students.filter(student => 
        student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.enrolled.some(course => 
          course.courseName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : students;

  // Function to handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Page header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4 flex items-center gap-2"
            onClick={() => router.push('/dashboard')}
          >
            <FaArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Student Management</h1>
          <p className="text-muted-foreground text-lg">
            View and manage students enrolled in your courses
          </p>
        </div>

        {/* Search and filter */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex max-w-md">
            <div className="relative flex-1 mr-2">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search students or courses..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>

        {/* Students table */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading students...</p>
          </div>
        ) : filteredStudents.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Enrolled Courses</TableHead>
                    <TableHead>Enrollment Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map(student => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center text-primary">
                            <FaUser size={12} />
                          </div>
                          {student.username}
                        </div>
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        {student.enrolled.map(course => (
                          <div key={course.courseId} className="mb-1">
                            <Link 
                              href={`/courses/${course.courseId}`}
                              className="text-primary hover:underline"
                            >
                              {course.courseName}
                            </Link>
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {student.enrolled[0]?.enrollmentDate}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-1"
                          asChild
                        >
                          <Link href={`/messages?user=${student.id}`}>
                            <FaEnvelope size={12} />
                            <span>Message</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-muted/30">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-medium mb-2">No students found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? "No students match your search criteria."
                  : "You don't have any students enrolled in your courses yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 