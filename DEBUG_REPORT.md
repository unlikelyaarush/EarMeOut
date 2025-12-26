# Profile Persistence Debug Report

## Executive Summary
Profile data is not being saved due to **three critical issues**:
1. **401 Unauthorized errors** during profile initialization (session not ready after signup)
2. **UPDATE operations failing silently** when profile doesn't exist (should use UPSERT)
3. **Insufficient error logging** making failures invisible

---

## Issue #1: Profile Initialization Fails with 401 Unauthorized

### Location
- **File**: `src/contexts/AuthContext.js`
- **Lines**: 56-64
- **Function**: `signUp()`

### Problem
When a user signs up, the code attempts to initialize a profile immediately:
```javascript
if (data.user && !error) {
    try {
        await profileService.initializeProfile(data.user.id, email);
    } catch (profileError) {
        console.log('Profile will be created on first profile page visit:', profileError);
        // Error is caught and ignored
    }
}
```

### Root Cause
**Evidence from Supabase logs:**
```
POST | 401 | /rest/v1/profiles?select=* | status_code:401
```

The user's session is not immediately available after `signUp()` completes, especially if:
- Email confirmation is required
- The session hasn't been established yet
- The auth state change hasn't propagated

RLS policies require `auth.uid() = id`, but `auth.uid()` returns `null` because there's no active session yet.

### Impact
- Profile initialization fails silently
- No profile row is created on signup
- User must visit `/profile` page to trigger profile creation

---

## Issue #2: UPDATE Fails When Profile Doesn't Exist

### Location
- **File**: `src/lib/profileService.js`
- **Lines**: 46-63
- **Function**: `updateProfile()`

### Problem
The `updateProfile()` function uses `.update()` which requires an existing row:

```javascript
async updateProfile(userId, updates) {
    const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();
    
    if (error) throw error;
    return data;
}
```

### Root Cause
If no profile exists:
- `.update()` returns 0 rows
- The query succeeds but `data` is `null`
- The function returns `null` instead of creating a profile
- No error is thrown, so the failure is silent

### Impact
- When user changes settings before profile exists, updates fail silently
- `saveProfileData()` in Profile.js shows "Changes saved" toast even though nothing was saved
- Data loss on page refresh

---

## Issue #3: Insufficient Error Logging

### Location
Multiple files:
- `src/lib/profileService.js` - lines 19, 40, 61, 95
- `src/components/Profile.js` - line 140
- `src/contexts/AuthContext.js` - line 62

### Problem
Errors are logged but:
1. Some use `console.log()` instead of `console.error()`
2. Errors are caught and ignored without user feedback
3. No error details logged (error.message, error.code, etc.)
4. No visibility into RLS policy failures

### Impact
- Developers can't diagnose issues
- Users see "Changes saved" even when save fails
- Silent failures make debugging impossible

---

## Database Configuration Analysis

### RLS Policies (✅ Correct)
```sql
-- SELECT: Users can view own profile
qual: (auth.uid() = id)

-- UPDATE: Users can update own profile  
qual: (auth.uid() = id)

-- INSERT: Users can insert own profile
with_check: (auth.uid() = id)
```

**Status**: Policies are correctly configured. The issue is timing - `auth.uid()` is `null` when called too early.

### Table Schema (✅ Correct)
- All required columns exist
- Foreign key to `auth.users.id` is correct
- Default values are set appropriately

---

## Evidence from Logs

### Failed Profile Insert (401 Unauthorized)
```
POST | 401 | /rest/v1/profiles?select=* | timestamp: 1766783261795000
```
This occurred immediately after signup, indicating session was not ready.

### Successful Signup
```
POST | 200 | /auth/v1/signup | timestamp: 1766783260589000
```
Signup succeeded, but profile creation failed.

---

## Fix Strategy

### Fix #1: Use UPSERT in updateProfile
Change `updateProfile()` to use `.upsert()` instead of `.update()` so it creates the profile if it doesn't exist.

### Fix #2: Defer Profile Initialization
Instead of creating profile during signup, ensure it's created:
- On first profile page visit (already implemented)
- Use UPSERT in updateProfile to handle missing profiles

### Fix #3: Enhanced Error Logging
- Log full error objects with `console.error()`
- Include error codes and messages
- Show user-friendly error messages when saves fail

### Fix #4: Verify Session Before DB Operations
Add session check before profile operations.

---

## Testing Checklist

After fixes, verify:
- [ ] New user signup creates profile row
- [ ] Existing user can load profile data
- [ ] Profile changes save successfully
- [ ] Profile persists after page refresh
- [ ] "Changes saved" toast only appears on successful save
- [ ] Console shows detailed error messages if save fails
- [ ] RLS policies allow authenticated users to access their profiles

---

## Files to Modify

1. `src/lib/profileService.js` - Change updateProfile to use upsert
2. `src/lib/profileService.js` - Enhance error logging
3. `src/components/Profile.js` - Add error handling for failed saves
4. `src/contexts/AuthContext.js` - Improve profile initialization error handling

---

## Root Cause Summary

**Primary Issue**: Session timing - profile initialization happens before session is established
**Secondary Issue**: Wrong operation - UPDATE instead of UPSERT when profile may not exist
**Tertiary Issue**: Silent failures - errors are caught and ignored without proper logging

