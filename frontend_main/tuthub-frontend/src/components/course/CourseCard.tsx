"use client";

import React from 'react';
import Link from 'next/link';
import { FaUser, FaYoutube } from 'react-icons/fa';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  teacher: {
    id: number;
    username: string;
  };
  linktoplaylist?: string;
  isEnrolled?: boolean;
  isEnrolling?: boolean;
  onEnroll?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  teacher,
  linktoplaylist,
  isEnrolled = false,
  isEnrolling = false,
  onEnroll,
}) => {
  // Truncate description if it's too long
  const truncatedDescription = description.length > 120
    ? `${description.substring(0, 120)}...`
    : description;

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl hover:text-primary transition-colors">
            <Link href={`/courses/${id}`}>{title}</Link>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground mb-4">{truncatedDescription}</p>
        <div className="flex items-center gap-2 mt-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback>
              {teacher.username?.substring(0, 2).toUpperCase() || 'T'}
            </AvatarFallback>
          </Avatar>
          <Link href={`/teachers/${teacher.id}`} className="text-sm hover:text-primary transition-colors">
            <FaUser className="inline mr-1" size={12} />
            {teacher.username}
          </Link>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4">
        {linktoplaylist && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={linktoplaylist} target="_blank" rel="noopener noreferrer">
              <FaYoutube className="mr-2" />
              Watch
            </Link>
          </Button>
        )}
        <Button
          onClick={onEnroll}
          disabled={isEnrolled || isEnrolling}
          className="ml-auto"
        >
          {isEnrolling ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Enrolling...
            </>
          ) : isEnrolled ? (
            'Enrolled'
          ) : (
            'Enroll'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard; 