# Scrum Application Setup Guide

## Quick Setup Steps

### 1. Environment Variables
Create a `.env.local` file in the root directory with the following content:

```env
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# Database (Required)
DATABASE_URL="postgresql://username:password@localhost:5432/scrum_db"

# Optional
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 2. Get Clerk Keys
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Go to API Keys in the sidebar
4. Copy your publishable key and secret key
5. Paste them in `.env.local`

### 3. Database Setup
1. Create a PostgreSQL database
2. Update the `DATABASE_URL` in `.env.local`
3. Run database migrations:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### 4. Start Development Server
```bash
npm run dev
```

## Common Issues & Solutions

### Build Errors
- **Clerk Keys Missing**: Ensure both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set
- **Database Connection**: Verify your PostgreSQL database is running and accessible
- **Prisma Issues**: Run `npx prisma generate` after any schema changes

### Runtime Errors
- **Authentication**: Make sure Clerk is properly configured with organizations enabled
- **Database**: Check that all tables were created successfully

## Next Steps
1. Sign up for a Clerk account
2. Configure Clerk organization settings
3. Create your first project in the app
4. Add team members and start managing sprints!

## Support
If you encounter issues:
1. Check the browser console for client-side errors
2. Check the terminal for server-side errors
3. Verify all environment variables are set correctly
4. Ensure the database is accessible and migrated
