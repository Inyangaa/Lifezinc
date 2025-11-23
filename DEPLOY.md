# Deploy LifeZinc to Vercel - Automatic Setup

## One-Time Setup (5 minutes)

### Step 1: Install Vercel CLI on your computer
Open your terminal and run:
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
This will open your browser - just click "Confirm" to log in.

### Step 3: Deploy
Navigate to your LifeZinc project folder and run:
```bash
vercel
```

Follow the prompts:
- "Set up and deploy?" → Yes
- "Which scope?" → Select your account
- "Link to existing project?" → No
- "What's your project's name?" → lifezinc (or whatever you prefer)
- "In which directory is your code located?" → ./ (just press Enter)
- Vercel will auto-detect it's a Vite project

### Step 4: Add Environment Variables
After the first deployment, go to your Vercel dashboard and add these environment variables:

```
VITE_SUPABASE_URL=https://zelbbjeuaalevquxsajs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplbGJiamV1YWFsZXZxdXhzYWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0ODM2NjcsImV4cCI6MjA3OTA1OTY2N30.DXIzUcaF6XgP2DkVD0X3678ASZNSrmTr8O4vMoWIaaY
```

Then run `vercel --prod` to deploy with the environment variables.

## That's it!

Your app will be live at a URL like: `https://lifezinc-xxxxx.vercel.app`

Every time you want to update your app, just run:
```bash
vercel --prod
```
