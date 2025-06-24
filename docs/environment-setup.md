# Environment Setup Guide

This guide will help you set up the required environment variables for the Karuna project.

## Required Environment Variables

The following environment variables are required for the application to function:

- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for backend operations)

## Optional Environment Variables

- `PICAOS_SECRET_KEY` - API key for AI-powered thank you letter generation

## Setup Instructions

### 1. Copy the Example File

```bash
cp .env.example .env
```

### 2. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Navigate to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public** key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Update Your .env File

Replace the placeholder values in your `.env` file:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# AI Integration (Optional)
PICAOS_SECRET_KEY=your_picaos_api_key

# Development
NODE_ENV=development
```

### 4. Verify Your Setup

Run the environment checker to make sure everything is configured correctly:

```bash
npm run check:env
```

You should see output like:
```
✅ EXPO_PUBLIC_SUPABASE_URL: Set
✅ EXPO_PUBLIC_SUPABASE_ANON_KEY: Set
✅ SUPABASE_SERVICE_ROLE_KEY: Set
⚠️  PICAOS_SECRET_KEY: Not set (optional)

✅ All required environment variables are set!
```

## Security Notes

- **Never commit your `.env` file** to version control
- The `.env` file is already included in `.gitignore`
- Keep your service role key secure - it has admin access to your database
- Use different keys for development and production environments

## Troubleshooting

### "Missing required environment variables" Error

If you see this error, it means one or more required environment variables are not set:

1. Make sure you've created the `.env` file
2. Check that all required variables are present and have values
3. Restart your development server after making changes
4. Run `npm run check:env` to verify

### "Invalid Supabase credentials" Error

This usually means:

1. Your Supabase URL or keys are incorrect
2. Your Supabase project is paused or deleted
3. You're using the wrong environment (development vs production)

### Getting Help

If you're still having issues:

1. Double-check your Supabase dashboard for the correct credentials
2. Make sure your Supabase project is active and not paused
3. Try creating a new set of API keys in Supabase
4. Contact the development team for assistance