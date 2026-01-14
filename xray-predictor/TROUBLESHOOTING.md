# Troubleshooting Guide

## Blank White Page

If you see a blank white page when running the app, follow these steps:

### Step 1: Check Browser Console

1. Open your browser's Developer Tools (F12 or Right-click > Inspect)
2. Go to the **Console** tab
3. Look for any red error messages
4. Share the error messages if you need help

### Step 2: Common Issues and Fixes

#### Issue: Firebase Configuration Error

**Symptoms:**
- Console shows: "Firebase: Error (auth/invalid-api-key)" or similar
- Blank white page

**Solution:**
1. Firebase is optional for basic functionality
2. The app should still work without Firebase
3. If you want authentication, set up Firebase (see FIREBASE_SETUP.md)
4. Or temporarily disable auth by commenting out AuthProvider in App.tsx

#### Issue: Module Not Found

**Symptoms:**
- Console shows: "Cannot find module..." or "Failed to resolve..."

**Solution:**
```bash
cd xray-predictor
npm install
npm run dev
```

#### Issue: Port Already in Use

**Symptoms:**
- Dev server won't start
- Error about port 3000

**Solution:**
```bash
# Kill the process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- --port 3001
```

#### Issue: Build Errors

**Symptoms:**
- TypeScript errors
- Compilation errors

**Solution:**
```bash
# Clear cache and reinstall
cd xray-predictor
rm -rf node_modules
rm -rf .vite
npm install
npm run dev
```

### Step 3: Quick Fix - Disable Auth Temporarily

If Firebase is causing issues and you just want to see the app:

1. Open `src/App.tsx`
2. Comment out the AuthProvider temporarily:

```tsx
<ThemeProvider>
  {/* <AuthProvider> */}
    <PremiumProvider>
      <Layout>
        {/* ... */}
      </Layout>
    </PremiumProvider>
  {/* </AuthProvider> */}
</ThemeProvider>
```

3. Also update ProtectedRoute to allow access:

```tsx
// In ProtectedRoute.tsx, temporarily return children directly
return <>{children}</>
```

### Step 4: Check Network Tab

1. Open Developer Tools > Network tab
2. Refresh the page
3. Look for failed requests (red)
4. Check if CSS/JS files are loading

### Step 5: Clear Browser Cache

1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Or clear browser cache completely

### Step 6: Check Terminal Output

Look at the terminal where you ran `npm run dev`:
- Are there any error messages?
- Does it say "Local: http://localhost:3000"?
- Are there compilation errors?

## Still Not Working?

1. **Check the browser console** - This is the most important step!
2. **Share the error messages** from the console
3. **Check the terminal** for build errors
4. **Verify Node.js version**: Should be v18 or higher

## Quick Test

To verify the app can render at all, try accessing:
- `http://localhost:3000/` - Should show Home page
- `http://localhost:3000/login` - Should show Login page

If these work, the issue is likely with a specific component or route.

