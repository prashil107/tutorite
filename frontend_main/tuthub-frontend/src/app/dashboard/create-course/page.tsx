"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTuthub } from '@/providers/TuthubProvider';
import API_BASE_URL from '@/config';

export default function CreateCoursePage() {
  const router = useRouter();
  const { authState } = useTuthub();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    linktoplaylist: '',
    teacher: authState.user?.id
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect non-teachers away from this page
    if (!authState.isAuthenticated || authState.user?.role !== 'teacher') {
      router.push('/');
    }
  }, [authState, router]);

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

      const userData = localStorage.getItem("tuthub_user");
      // Make API call to the backend
      const response = await fetch(`${API_BASE_URL}/api/courses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create course');
      }
      
      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Create New Course</h1>
          <p className="text-muted-foreground text-lg">
            Add details to create your new course
          </p>
        </div>

        {/* Course creation form */}
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
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



              {/* No category for now and difficulty level*/}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="photography">Photography</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="level">Difficulty Level</Label>
                  <Select 
                    value={formData.level}
                    onValueChange={(value) => handleSelectChange('level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="all">All Levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div> */}

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
              {/* No thumbnailUrl and price for now*/}
              {/* <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">Thumbnail Image URL</Label>
                <Input
                  id="thumbnailUrl"
                  name="thumbnailUrl"
                  placeholder="e.g., https://example.com/thumbnail.jpg"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00 for free courses"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div> */}
              
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
                  {isSubmitting ? 'Creating Course...' : 'Create Course'}
                </Button>
              </div>



            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 