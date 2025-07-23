"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FaUser, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTuthub } from '@/providers/TuthubProvider';
import { toast } from 'sonner';

// Profile form schema
const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { authState, updateProfile } = useTuthub();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize form with user data
  // Always call hooks at the top level, regardless of auth state
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: authState.user?.username || '',
      email: authState.user?.email || '',
      bio: authState.user?.bio || '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: ProfileFormValues) => {
    setLoading(true);
    try {
      await updateProfile(values);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If not authenticated, show login prompt
  if (!authState.isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto bg-muted/30 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Not Signed In</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your profile.
          </p>
          <Button onClick={() => {
            // This would typically navigate to login or open login modal
            toast.info('Please use the Sign In button in the navigation bar');
          }}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Info Card */}
          <div className="md:col-span-1">
            <Card className="bg-background">
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                    {authState.user?.username?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{authState.user?.username}</CardTitle>
                <div className="text-muted-foreground capitalize">
                  {authState.user?.role}
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={() => setEditing(!editing)} 
                  variant={editing ? "secondary" : "outline"}
                  className="w-full"
                >
                  {editing ? (
                    <>
                      <FaTimes className="mr-2" />
                      Cancel Editing
                    </>
                  ) : (
                    <>
                      <FaEdit className="mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form Card */}
          <div className="md:col-span-2">
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaUser className="mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!editing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!editing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              disabled={!editing}
                              placeholder="Tell us about yourself" 
                              className="resize-none" 
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {editing && (
                      <Button type="submit" disabled={loading} className="w-full">
                        {loading ? 'Saving...' : (
                          <>
                            <FaSave className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 