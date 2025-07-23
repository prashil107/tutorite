"use client";

import React from 'react';
import Link from 'next/link';
import { FaSearch, FaGraduationCap, FaChalkboardTeacher, FaComments, FaArrowRight } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/course/CourseCard';
import { MockData } from '@/lib/api';
import BackgroundGradientAnimationDemo from '@/components/background-gradient-animation-demo';

export default function HomePage() {
  // Featured courses - normally would come from an API call
  const featuredCourses = MockData.courses.slice(0, 3);
  
  // Featured teachers - normally would come from an API call
  const featuredTeachers = MockData.users.filter(user => user.role === 'teacher').slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Animation */}
      <BackgroundGradientAnimationDemo />

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Learn from Experts</h3>
            <p className="text-muted-foreground">
              Access courses taught by experienced teachers who are passionate about sharing their knowledge.
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Flexible Learning</h3>
            <p className="text-muted-foreground">
              Learn at your own pace with our comprehensive course materials and video lessons.
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Community Support</h3>
            <p className="text-muted-foreground">
              Join a community of learners and get support from teachers and fellow students.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore our wide range of courses and start your learning journey today.
          </p>
          <Button asChild size="lg">
            <Link href="/courses" className="gap-2">
              Browse Courses
              <FaArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
