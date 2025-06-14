# Supabase Setup Guide for Portfolio Admin

This guide will help you set up Supabase for your portfolio admin dashboard.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A Supabase project created

## Setup Steps

### 1. Configure Supabase Connection

Your Supabase configuration is already set up in `src/lib/supabase.ts`. The current configuration uses:

- **Project URL**: `https://frwnqxhmviattxscjacu.supabase.co`
- **Anon Key**: Already configured

### 2. Set Up Database Tables

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-setup.sql` into the SQL editor
4. Run the SQL commands to create all necessary tables and policies

### 3. Authentication Setup

1. In your Supabase dashboard, go to **Authentication** > **Settings**
2. Configure your site URL (e.g., `http://localhost:5173` for development)
3. Add any additional redirect URLs if needed

### 4. Storage Setup

The SQL script automatically creates a `profile-pictures` bucket for user profile images. If you need to create it manually:

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket named `profile-pictures`
3. Make it public
4. The RLS policies are already set up in the SQL script

## Database Schema

### Tables Created:

1. **profiles** - User profile information
   - `id`, `user_id`, `full_name`, `email`, `bio`, `github_url`, `linkedin_url`, `profile_picture_url`

2. **projects** - Portfolio projects
   - `id`, `title`, `description`, `type`, `tech_stack`, `live_url`, `github_url`, `image_url`, `featured`

3. **skills** - User skills and proficiencies
   - `id`, `name`, `category`, `proficiency`

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:
- Users can only manage their own profiles
- Projects and skills are viewable by authenticated users
- Admin users can manage all projects and skills

## Admin Access

### Creating an Admin User

1. Sign up through the admin login page (`/admin/login`)
2. Use the demo credentials provided in the login form:
   - **Email**: `admin@arafmahmud.com`
   - **Password**: `demo123`

Or create your own admin user:
1. Go to Supabase Dashboard > Authentication > Users
2. Create a new user or invite via email
3. The current setup allows any authenticated user to access the admin panel

### Features Available

✅ **Projects Management**
- Add, edit, delete projects
- Set featured projects
- Manage tech stack and URLs

✅ **Skills Management**
- Add, edit, delete skills
- Set proficiency levels
- Organize by categories

✅ **Profile Management**
- Update personal information
- Upload profile pictures
- Manage social links

✅ **Dashboard Overview**
- View statistics
- Recent projects
- Quick actions

## Development

### Running the Project

```bash
npm install
npm run dev
```

### Environment Variables

If you need to use environment variables instead of hardcoded values:

1. Create a `.env.local` file
2. Add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Update `src/lib/supabase.ts` to use environment variables:
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

## Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check if your site URL is configured correctly in Supabase
   - Verify the Supabase URL and keys are correct

2. **Database operations failing**
   - Ensure all tables are created by running the SQL setup script
   - Check RLS policies are properly configured

3. **File upload not working**
   - Verify the `profile-pictures` bucket exists and is public
   - Check storage policies are correctly set up

4. **Admin access denied**
   - The current setup allows any authenticated user admin access
   - For production, implement proper role-based access control

### Support

If you encounter issues:
1. Check the browser console for error messages
2. Review the Supabase dashboard logs
3. Ensure all SQL commands from the setup script ran successfully

## Security Notes

- The current setup is configured for development/demo purposes
- For production use, implement proper admin role checking
- Consider adding additional security measures like email verification
- Review and adjust RLS policies based on your specific needs

## Next Steps

1. Customize the admin dashboard to match your needs
2. Add more project fields if required
3. Implement proper admin role management
4. Add data validation and error handling
5. Set up automated backups for your Supabase project