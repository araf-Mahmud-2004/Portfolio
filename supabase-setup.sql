-- =================================================================
-- COMPLETE SUPABASE SETUP FOR PORTFOLIO ADMIN
-- =================================================================
-- This is a comprehensive setup script that combines all necessary
-- database tables, storage buckets, RLS policies, and sample data.
-- Run this entire script in your Supabase SQL editor.
-- =================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================================================================
-- 1. CREATE TABLES
-- =================================================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    bio TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    profile_picture_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint to user_id if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_user_id_key' 
        AND table_name = 'profiles'
    ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT DEFAULT 'personal' CHECK (type IN ('personal', 'official', 'collaboration')),
    tech_stack TEXT[] DEFAULT '{}',
    live_url TEXT,
    github_url TEXT,
    image_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Frontend Development',
    proficiency INTEGER DEFAULT 50 CHECK (proficiency >= 0 AND proficiency <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================
-- 2. CREATE STORAGE BUCKETS
-- =================================================================

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- =================================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- =================================================================
-- 4. DROP EXISTING POLICIES (to avoid conflicts)
-- =================================================================

-- Drop existing profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read access" ON public.profiles;
DROP POLICY IF EXISTS "Allow individual user insert access" ON public.profiles;
DROP POLICY IF EXISTS "Allow individual user update access" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read access for profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;

-- Drop existing projects policies
DROP POLICY IF EXISTS "Authenticated users can view projects" ON public.projects;
DROP POLICY IF EXISTS "Admin users can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Allow public read access for projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated users to manage projects" ON public.projects;

-- Drop existing skills policies
DROP POLICY IF EXISTS "Authenticated users can view skills" ON public.skills;
DROP POLICY IF EXISTS "Admin users can manage skills" ON public.skills;
DROP POLICY IF EXISTS "Allow public read access for skills" ON public.skills;
DROP POLICY IF EXISTS "Allow authenticated users to manage skills" ON public.skills;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Users can upload their own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Profile pictures are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow user to update their own picture" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload for own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Allow update for own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Project images are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete project images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for project images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update project images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete project images" ON storage.objects;

-- =================================================================
-- 5. CREATE RLS POLICIES FOR TABLES
-- =================================================================

-- Profiles table policies
CREATE POLICY "Allow public read access for profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Allow users to insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Projects table policies (public read, authenticated write)
CREATE POLICY "Allow public read access for projects" ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage projects" ON public.projects
    FOR ALL USING (auth.role() = 'authenticated');

-- Skills table policies (public read, authenticated write)
CREATE POLICY "Allow public read access for skills" ON public.skills
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage skills" ON public.skills
    FOR ALL USING (auth.role() = 'authenticated');

-- =================================================================
-- 6. CREATE STORAGE POLICIES
-- =================================================================

-- Profile pictures storage policies
CREATE POLICY "Public read access for profile pictures" ON storage.objects
    FOR SELECT USING (bucket_id = 'profile-pictures');

CREATE POLICY "Allow upload for own profile picture" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'profile-pictures' AND
        auth.uid() IS NOT NULL AND
        name = auth.uid()::text || '.' || storage.extension(name)
    );

CREATE POLICY "Allow update for own profile picture" ON storage.objects
    FOR UPDATE TO authenticated
    USING (
        bucket_id = 'profile-pictures' AND
        auth.uid() IS NOT NULL AND
        name = auth.uid()::text || '.' || storage.extension(name)
    );

-- Project images storage policies
CREATE POLICY "Public read access for project images" ON storage.objects
    FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Allow authenticated users to upload project images" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'project-images' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Allow authenticated users to update project images" ON storage.objects
    FOR UPDATE TO authenticated
    USING (
        bucket_id = 'project-images' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Allow authenticated users to delete project images" ON storage.objects
    FOR DELETE TO authenticated
    USING (
        bucket_id = 'project-images' AND
        auth.role() = 'authenticated'
    );

-- =================================================================
-- 7. CREATE TRIGGER FUNCTIONS AND TRIGGERS
-- =================================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS handle_updated_at ON public.profiles;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.projects;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.skills;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.skills
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =================================================================
-- 8. INSERT SAMPLE DATA (OPTIONAL)
-- =================================================================

-- Sample skills (using INSERT with WHERE NOT EXISTS)
INSERT INTO public.skills (name, category, proficiency) 
SELECT 'React', 'Frontend Development', 90
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'React');

INSERT INTO public.skills (name, category, proficiency) 
SELECT 'TypeScript', 'Frontend Development', 85
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'TypeScript');

INSERT INTO public.skills (name, category, proficiency) 
SELECT 'JavaScript ES6+', 'Frontend Development', 88
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'JavaScript ES6+');

INSERT INTO public.skills (name, category, proficiency) 
SELECT 'HTML5', 'Frontend Development', 95
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'HTML5');

INSERT INTO public.skills (name, category, proficiency) 
SELECT 'CSS3', 'Frontend Development', 90
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'CSS3');

INSERT INTO public.skills (name, category, proficiency) 
SELECT 'Tailwind CSS', 'Styling & Design', 88
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Tailwind CSS');

INSERT INTO public.skills (name, category, proficiency) 
SELECT 'SCSS', 'Styling & Design', 80
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'SCSS');

INSERT INTO public.skills (name, category, proficiency) 
SELECT 'Responsive Design', 'Styling & Design', 92
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Responsive Design');

INSERT INTO public.skills (name, category, proficiency) 
SELECT 'Node.js', 'Backend & Database', 80
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Node.js');

INSERT INTO public.skills (name, category, proficiency) 
SELECT 'Supabase', 'Backend & Database', 85
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Supabase');

INSERT INTO public.skills (name, category, proficiency) 
SELECT 'PostgreSQL', 'Backend & Database', 75
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'PostgreSQL');

INSERT INTO public.skills (name, category, proficiency) 
SELECT 'REST APIs', 'Backend & Database', 85
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'REST APIs');

INSERT INTO public.skills (name, category, proficiency) 
SELECT 'Git', 'Development Tools', 90
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Git');

INSERT INTO public.skills (name, category, proficiency) 
SELECT 'GitHub', 'Development Tools', 88
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'GitHub');

INSERT INTO public.skills (name, category, proficiency) 
SELECT 'Vite', 'Development Tools', 85
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Vite');

INSERT INTO public.skills (name, category, proficiency) 
SELECT 'npm/yarn', 'Development Tools', 90
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'npm/yarn');

-- Sample projects (using INSERT with WHERE NOT EXISTS)
INSERT INTO public.projects (title, description, type, tech_stack, live_url, github_url, featured) 
SELECT 'Portfolio Website', 'A modern, responsive portfolio website built with React and TypeScript, featuring dynamic content management through Supabase integration.', 'personal', ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Framer Motion'], 'https://your-portfolio.com', 'https://github.com/araf-Mahmud-2004/portfolio', true
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE title = 'Portfolio Website');

INSERT INTO public.projects (title, description, type, tech_stack, live_url, github_url, featured) 
SELECT 'Task Management App', 'A full-stack task management application with real-time updates, user authentication, and collaborative features.', 'personal', ARRAY['React', 'Node.js', 'Supabase', 'TypeScript'], 'https://your-task-app.com', 'https://github.com/araf-Mahmud-2004/task-app', false
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE title = 'Task Management App');

INSERT INTO public.projects (title, description, type, tech_stack, live_url, github_url, featured) 
SELECT 'E-commerce Dashboard', 'An admin dashboard for e-commerce management with analytics, inventory tracking, and order management.', 'official', ARRAY['React', 'TypeScript', 'Chart.js', 'Tailwind CSS'], 'https://your-dashboard.com', 'https://github.com/araf-Mahmud-2004/ecommerce-dashboard', true
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE title = 'E-commerce Dashboard');

-- =================================================================
-- SETUP COMPLETE!
-- =================================================================
-- Your Supabase database is now fully configured with:
-- ✅ All necessary tables (profiles, projects, skills)
-- ✅ Storage buckets for images
-- ✅ Proper RLS policies for security
-- ✅ Trigger functions for automatic timestamps
-- ✅ Sample data to get you started
-- 
-- You can now use your admin panel to manage content!
-- =================================================================