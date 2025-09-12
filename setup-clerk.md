# Clerk Setup Instructions

## Step 1: Create Clerk Account
1. Go to [https://dashboard.clerk.com/](https://dashboard.clerk.com/)
2. Sign up for a free account
3. Create a new application

## Step 2: Get Your API Keys
1. In the Clerk dashboard, go to "API Keys" in the sidebar
2. Copy your **Publishable Key** (starts with `pk_test_`)
3. Copy your **Secret Key** (starts with `sk_test_`)

## Step 3: Update Environment Variables
Replace the placeholder values in your `.env.local` file:

```env
# Replace these with your actual Clerk keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here

# Database (already set up)
DATABASE_URL="file:./dev.db"

# Next.js
NEXTAUTH_SECRET=your_random_secret_here_32_chars_minimum
NEXTAUTH_URL=http://localhost:3000
```

## Step 4: Configure Clerk Settings
1. In Clerk dashboard, go to "Organizations" 
2. Enable organizations (required for this app)
3. Configure authentication methods (Google, email/password)

## Step 5: Test the Setup
After updating the environment variables, run:
```bash
npm run dev
```

The app should now start successfully!
