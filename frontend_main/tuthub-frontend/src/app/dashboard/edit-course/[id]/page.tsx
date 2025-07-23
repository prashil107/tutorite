"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTuthub } from '@/providers/TuthubProvider';
import { MockData } from '@/lib/api';
import API_BASE_URL from '@/config';

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = Number(params.id);
  const { authState } = useTuthub();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    linktoplaylist: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect non-teachers away from this page
    if (!authState.isAuthenticated || authState.user?.role !== 'teacher') {
      router.push('/');
      return;
    }

    const fetchCourse = async () => {
      try {
        // Fetch course data from the API
        const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
          headers: {
            'Authorization': `Bearer ${authState.token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Course not found');
        }
        
        const course = await response.json();
        
        // Check if the logged-in teacher owns this course
        if (course.teacher !== authState.user?.id) {
          throw new Error('You do not have permission to edit this course');
        }
        
        // Set form data with course information
        setFormData({
          title: course.title,
          description: course.description,
          linktoplaylist: course.linktoplaylist || '',
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId, authState, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form
      if (!formData.title || !formData.description) {
        throw new Error('Please fill in all required fields');
      }

      // Make API call to update course
      const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update course');
      }
      
      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading course data...</p>
        </div>
      </div>
    );
  }

  if (error && (error.includes('not found') || error.includes('permission'))) {
    return (
      <div className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-semibold mb-4">Error</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Edit Course</h1>
          <p className="text-muted-foreground text-lg">
            Update your course details
          </p>
        </div>

        {/* Course edit form */}
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && !(error.includes('not found') || error.includes('permission')) && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Complete JavaScript Course"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Course Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your course and what students will learn"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linktoplaylist">Video Playlist URL</Label>
                <Input
                  id="linktoplaylist"
                  name="linktoplaylist"
                  placeholder="e.g., https://youtube.com/playlist?list=..."
                  value={formData.linktoplaylist}
                  onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground">
                  Provide a playlist link to your course videos (YouTube, Vimeo, etc.)
                </p>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 