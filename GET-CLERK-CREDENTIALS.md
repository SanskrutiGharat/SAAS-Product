# 🚀 Get Clerk Credentials - Step by Step Guide

## Step 1: Go to Clerk Dashboard
👉 **Click here**: [https://dashboard.clerk.com/](https://dashboard.clerk.com/)

## Step 2: Sign Up (if you don't have an account)
1. Click "Sign up" or "Get started"
2. Use your email or Google account
3. Verify your email if needed

## Step 3: Create a New Application
1. Click "Create application" or "New project"
2. Choose a name for your app (e.g., "SAAS-Product" or "Scrum App")
3. Select "Next.js" as your framework
4. Click "Create application"

## Step 4: Get Your API Keys
1. In the left sidebar, click **"API Keys"**
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

## Step 5: Copy the Keys
Copy both keys - you'll need them in the next step!

## Step 6: Configure Your App
1. In the left sidebar, click **"Organizations"**
2. Make sure organizations are **enabled** (this app requires it)
3. Go to **"Authentication"** → **"Social connections"**
4. Enable **Google** and **Email/Password** if you want

## Step 7: Update Your Environment File
Open your `.env.local` file and replace the placeholder values:

```env
# Replace with your actual keys from Step 4
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here

# Database (already set up)
DATABASE_URL="file:./dev.db"

# Next.js
NEXTAUTH_SECRET=your_random_secret_here_32_chars_minimum
NEXTAUTH_URL=http://localhost:3000
```

## Step 8: Test Your Setup
After updating the environment file, restart your server:
```bash
npm run dev
```

## 🎉 You're Done!
Your app should now work perfectly! You can:
- Sign up for an account
- Create organizations
- Create projects and manage sprints
- Use the Kanban board

## Need Help?
If you get stuck, just let me know and I'll help you troubleshoot!
