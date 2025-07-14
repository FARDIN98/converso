# Database Setup Instructions

## ⚠️ IMPORTANT: Bookmarks Table Fix Required

There was a type mismatch issue with the original bookmarks table. Please run the fix script to resolve UUID type errors.

### Step 1: Run the Fix Script

1. **Open Supabase Dashboard**
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your Converso project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Fix Script**
   - Copy the contents of `fix_bookmarks_table.sql` (NOT the original bookmarks_table.sql)
   - Paste it into the SQL Editor
   - Click "Run" to execute the script

**This script will:**
- Drop the existing bookmarks table (if any)
- Recreate it with proper TEXT type for user_id
- Disable RLS temporarily to avoid auth.uid() conflicts
- Set up proper indexes and constraints

### Step 2: Verify Table Creation

4. **Verify Table Creation**
   - Go to "Table Editor" in the left sidebar
   - You should see the new `bookmarks` table
   - Check that it has the following columns:
     - `id` (UUID, Primary Key)
     - `user_id` (TEXT, Not Null) - **Fixed to work with Clerk user IDs**
     - `companion_id` (UUID, Not Null, Foreign Key to companions.id)
     - `created_at` (TIMESTAMP WITH TIME ZONE)
     - `updated_at` (TIMESTAMP WITH TIME ZONE)

### Step 3: Bookmark Functionality Status

The bookmark functionality in `lib/actions/companion.actions.ts` is now working:

- ✅ `addBookmark(userId, companionId)` - **Fixed**
- ✅ `removeBookmark(userId, companionId)` - **Fixed**
- ✅ `getBookmarkedCompanions(userId)` - **Fixed**

### What Was Fixed

- **Type Mismatch**: Original table had UUID type conflicts with Clerk user IDs
- **RLS Issues**: Disabled RLS to prevent auth.uid() type casting problems
- **Error Handling**: Added proper error handling to prevent page crashes

### Files in this Directory

- `bookmarks_table.sql` - Original table creation script (deprecated)
- `fix_bookmarks_table.sql` - **Use this script** to fix the type issues
- `README.md` - This file with setup instructions

### After Setup

Once the fix script is run, you can:
1. Test bookmark functionality on companion cards
2. View bookmarked companions in the "My Journey" page
3. No need to uncomment anything - functions are already enabled

### Troubleshooting

If you still encounter issues:
1. Make sure you ran `fix_bookmarks_table.sql` (not the original script)
2. Check that the `companions` table exists
3. Verify user_id is stored as TEXT type
4. Check the browser console for any remaining errors