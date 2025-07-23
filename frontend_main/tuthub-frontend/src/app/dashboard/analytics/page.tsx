"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaEye, FaUserGraduate, FaClock } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MockData } from '@/lib/api';
import { useTuthub } from '@/providers/TuthubProvider';

export default function AnalyticsPage() {
  const router = useRouter();
  const { authState } = useTuthub();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [teacherCourses, setTeacherCourses] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState({
    totalViews: 142,
    totalStudents: 28,
    completionRate: 68,
    averageRating: 4.7,
    popularCourse: '',
    courseData: [] as any[],
  });

  useEffect(() => {
    // Redirect non-teachers away from this page
    if (!authState.isAuthenticated || authState.user?.role !== 'teacher') {
      router.push('/');
      return;
    }

    // Load teacher's courses and analytics data (mock data)
    if (authState.user) {
      // Get courses for this teacher
      const courses = MockData.courses.filter(
        course => course.teacher === authState.user?.id
      );
      setTeacherCourses(courses);
      
      // Generate mock analytics data
      if (courses.length > 0) {
        const courseAnalytics = courses.map(course => ({
          id: course.id,
          title: course.title,
          views: Math.floor(Math.random() * 100) + 20,
          students: Math.floor(Math.random() * 30) + 5,
          completionRate: Math.floor(Math.random() * 100),
          rating: (Math.random() * 2 + 3).toFixed(1),
          monthlyData: Array.from({ length: 6 }, (_, i) => ({
            month: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' }),
            views: Math.floor(Math.random() * 80) + 10,
            enrollments: Math.floor(Math.random() * 15) + 2,
          })).reverse(),
        }));
        
        // Find the most popular course
        const mostPopular = courseAnalytics.reduce((prev, current) => 
          (current.students > prev.students) ? current : prev, courseAnalytics[0]);
          
        setAnalyticsData({
          totalViews: courseAnalytics.reduce((sum, course) => sum + course.views, 0),
          totalStudents: courseAnalytics.reduce((sum, course) => sum + course.students, 0),
          completionRate: Math.floor(courseAnalytics.reduce((sum, course) => sum + course.completionRate, 0) / courseAnalytics.length),
          averageRating: parseFloat((courseAnalytics.reduce((sum, course) => sum + parseFloat(course.rating), 0) / courseAnalytics.length).toFixed(1)),
          popularCourse: mostPopular.title,
          courseData: courseAnalytics,
        });
      }
      
      setIsLoading(false);
    }
  }, [authState, router]);

  // Get data for selected course or all courses
  const selectedCourseData = selectedCourse === 'all'
    ? analyticsData.courseData
    : analyticsData.courseData.filter(course => course.id.toString() === selectedCourse);

  // Mock table data for student engagement
  const studentEngagementData = [
    { metric: 'Average time spent', value: '42 minutes' },
    { metric: 'Course completion rate', value: `${analyticsData.completionRate}%` },
    { metric: 'Assignment submission rate', value: '78%' },
    { metric: 'Discussion participation', value: '45%' },
    { metric: 'Video watch completion', value: '82%' },
  ];

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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Course Analytics</h1>
          <p className="text-muted-foreground text-lg">
            Track performance and engagement metrics for your courses
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading analytics data...</p>
          </div>
        ) : (
          <>
            {/* Course selection */}
            <div className="mb-8 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">Course:</span>
                <Select 
                  value={selectedCourse} 
                  onValueChange={setSelectedCourse}
                >
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {teacherCourses.map(course => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stats overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1">Total Views</p>
                    <p className="text-3xl font-bold">
                      {selectedCourse === 'all' 
                        ? analyticsData.totalViews 
                        : selectedCourseData[0]?.views || 0}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <FaEye className="h-6 w-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1">Enrolled Students</p>
                    <p className="text-3xl font-bold">
                      {selectedCourse === 'all' 
                        ? analyticsData.totalStudents 
                        : selectedCourseData[0]?.students || 0}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <FaUserGraduate className="h-6 w-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1">Completion Rate</p>
                    <p className="text-3xl font-bold">
                      {selectedCourse === 'all' 
                        ? analyticsData.completionRate 
                        : selectedCourseData[0]?.completionRate || 0}%
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <FaClock className="h-6 w-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground mb-1">Average Rating</p>
                    <p className="text-3xl font-bold">
                      {selectedCourse === 'all' 
                        ? analyticsData.averageRating 
                        : selectedCourseData[0]?.rating || 0}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <div className="text-primary font-bold">★</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="engagement">Student Engagement</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
              </TabsList>
              
              {/* Overview tab */}
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Monthly views chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Views</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <div className="h-[300px] flex items-end justify-between gap-2">
                        {selectedCourseData[0]?.monthlyData.map((data: any, index: number) => (
                          <div key={index} className="flex flex-col items-center">
                            <div 
                              className="bg-primary/80 w-12 rounded-t-sm" 
                              style={{ height: `${data.views * 2}px` }}
                            ></div>
                            <span className="text-xs mt-2">{data.month}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Monthly enrollments chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>New Enrollments</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <div className="h-[300px] flex items-end justify-between gap-2">
                        {selectedCourseData[0]?.monthlyData.map((data: any, index: number) => (
                          <div key={index} className="flex flex-col items-center">
                            <div 
                              className="bg-primary/80 w-12 rounded-t-sm" 
                              style={{ height: `${data.enrollments * 15}px` }}
                            ></div>
                            <span className="text-xs mt-2">{data.month}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Student Engagement tab */}
              <TabsContent value="engagement">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Engagement Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {studentEngagementData.map((item, index) => (
                        <div key={index} className="flex flex-col">
                          <div className="flex justify-between mb-2">
                            <span className="text-muted-foreground">{item.metric}</span>
                            <span className="font-medium">{item.value}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ 
                                width: typeof item.value === 'string' && item.value.includes('%') 
                                  ? item.value 
                                  : '50%' 
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Revenue tab */}
              <TabsContent value="revenue">
                <Card className="bg-muted/30">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-medium mb-2">Revenue Analytics</h3>
                    <p className="text-muted-foreground mb-4">
                      Revenue tracking will be available soon.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
} 