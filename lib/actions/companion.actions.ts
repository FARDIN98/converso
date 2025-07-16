/**
 * @fileoverview Server actions for companion management and operations
 * Handles CRUD operations, session tracking, bookmarks, and user permissions
 * for learning companions in the Converso application.
 */

'use server';

// Authentication utilities from Clerk
import {auth} from "@clerk/nextjs/server";
// Supabase client for database operations
import {createSupabaseClient} from "@/lib/supabase";
// Next.js cache revalidation utility
import { revalidatePath } from "next/cache";

/**
 * Creates a new learning companion in the database
 * 
 * @async
 * @function createCompanion
 * @param {CreateCompanion} formData - The companion data from the form
 * @returns {Promise<Companion>} The created companion object
 * @throws {Error} When companion creation fails or user is not authenticated
 * 
 * @example
 * const companion = await createCompanion({
 *   name: "Math Tutor",
 *   subject: "Mathematics",
 *   topic: "Algebra",
 *   voice: "alloy",
 *   style: "friendly",
 *   duration: 30
 * });
 */
export const createCompanion = async (formData: CreateCompanion) => {
    // Get authenticated user ID to set as companion author
    const { userId: author } = await auth();
    const supabase = createSupabaseClient();

    // Insert new companion with form data and author ID
    const { data, error } = await supabase
        .from('companions')
        .insert({...formData, author })
        .select();

    // Handle creation errors
    if(error || !data) throw new Error(error?.message || 'Failed to create a companion');

    // Return the created companion
    return data[0];
}

/**
 * Retrieves all companions with optional filtering and pagination
 * 
 * @async
 * @function getAllCompanions
 * @param {GetAllCompanions} options - Query options for filtering and pagination
 * @param {number} [options.limit=10] - Maximum number of companions to return
 * @param {number} [options.page=1] - Page number for pagination
 * @param {string} [options.subject] - Filter by subject (case-insensitive)
 * @param {string} [options.topic] - Filter by topic or name (case-insensitive)
 * @returns {Promise<Companion[]>} Array of companions matching the criteria
 * @throws {Error} When database query fails
 * 
 * @example
 * // Get first 10 companions
 * const companions = await getAllCompanions({ limit: 10, page: 1 });
 * 
 * @example
 * // Filter by subject and topic
 * const mathCompanions = await getAllCompanions({
 *   subject: "Mathematics",
 *   topic: "algebra",
 *   limit: 5
 * });
 */
export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
    const supabase = createSupabaseClient();

    // Start with base query
    let query = supabase.from('companions').select();

    // Apply filters based on provided parameters
    if(subject && topic) {
        // Filter by both subject and topic/name
        query = query.ilike('subject', `%${subject}%`)
            .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    } else if(subject) {
        // Filter by subject only
        query = query.ilike('subject', `%${subject}%`)
    } else if(topic) {
        // Filter by topic or name only
        query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    }

    // Apply pagination
    query = query.range((page - 1) * limit, page * limit - 1);

    // Execute query
    const { data: companions, error } = await query;

    // Handle query errors
    if(error) throw new Error(error.message);

    return companions;
}

/**
 * Retrieves a single companion by its ID
 * 
 * @async
 * @function getCompanion
 * @param {string} id - The unique identifier of the companion
 * @returns {Promise<Companion|undefined>} The companion object or undefined if not found
 * 
 * @example
 * const companion = await getCompanion("123e4567-e89b-12d3-a456-426614174000");
 * if (companion) {
 *   console.log(companion.name);
 * }
 */
export const getCompanion = async (id: string) => {
    const supabase = createSupabaseClient();

    // Query companion by ID
    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('id', id);

    // Log error if query fails (non-blocking)
    if(error) return console.log(error);

    // Return first (and only) result
    return data[0];
}

/**
 * Records a new session in the user's session history
 * 
 * @async
 * @function addToSessionHistory
 * @param {string} companionId - The ID of the companion used in the session
 * @returns {Promise<any>} The created session history record
 * @throws {Error} When session recording fails or user is not authenticated
 * 
 * @example
 * await addToSessionHistory("123e4567-e89b-12d3-a456-426614174000");
 */
export const addToSessionHistory = async (companionId: string) => {
    // Get authenticated user ID
    const { userId } = await auth();
    const supabase = createSupabaseClient();
    
    // Insert new session record
    const { data, error } = await supabase.from('session_history')
        .insert({
            companion_id: companionId,
            user_id: userId,
        })

    // Handle insertion errors
    if(error) throw new Error(error.message);

    return data;
}

/**
 * Retrieves the most recent companion sessions across all users
 * 
 * @async
 * @function getRecentSessions
 * @param {number} [limit=10] - Maximum number of recent sessions to return
 * @returns {Promise<Companion[]>} Array of companions from recent sessions
 * @throws {Error} When database query fails
 * 
 * @example
 * const recentCompanions = await getRecentSessions(5);
 */
export const getRecentSessions = async (limit = 10) => {
    const supabase = createSupabaseClient();
    
    // Query recent sessions with companion data
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id (*)`)
        .order('created_at', { ascending: false })
        .limit(limit)

    // Handle query errors
    if(error) throw new Error(error.message);

    // Extract companion data from session records
    return data.map(({ companions }) => companions);
}

/**
 * Retrieves session history for a specific user
 * 
 * @async
 * @function getUserSessions
 * @param {string} userId - The ID of the user whose sessions to retrieve
 * @param {number} [limit=10] - Maximum number of sessions to return
 * @returns {Promise<Companion[]>} Array of companions from user's sessions
 * @throws {Error} When database query fails
 * 
 * @example
 * const userSessions = await getUserSessions("user_123", 5);
 */
export const getUserSessions = async (userId: string, limit = 10) => {
    const supabase = createSupabaseClient();
    
    // Query user's sessions with companion data
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id (*)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    // Handle query errors
    if(error) throw new Error(error.message);

    // Extract companion data from session records
    return data.map(({ companions }) => companions);
}

/**
 * Retrieves all companions created by a specific user
 * 
 * @async
 * @function getUserCompanions
 * @param {string} userId - The ID of the user whose companions to retrieve
 * @returns {Promise<Companion[]>} Array of companions created by the user
 * @throws {Error} When database query fails
 * 
 * @example
 * const myCompanions = await getUserCompanions("user_123");
 */
export const getUserCompanions = async (userId: string) => {
    const supabase = createSupabaseClient();
    
    // Query companions authored by the user
    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('author', userId)

    // Handle query errors
    if(error) throw new Error(error.message);

    return data;
}

/**
 * Checks if the current user has permission to create a new companion
 * based on their subscription plan and current companion count
 * 
 * @async
 * @function newCompanionPermissions
 * @returns {Promise<boolean>} True if user can create a new companion, false otherwise
 * @throws {Error} When database query fails or user is not authenticated
 * 
 * @description
 * Permission logic:
 * - Pro plan users: unlimited companions
 * - Users with "3_companion_limit" feature: max 3 companions
 * - Users with "10_companion_limit" feature: max 10 companions
 * - Default: no companions allowed
 * 
 * @example
 * const canCreate = await newCompanionPermissions();
 * if (canCreate) {
 *   // Show create companion form
 * } else {
 *   // Show upgrade prompt
 * }
 */
export const newCompanionPermissions = async () => {
    // Get user authentication and plan information
    const { userId, has } = await auth();
    const supabase = createSupabaseClient();

    let limit = 0;

    // Check user's plan and set companion limit
    if(has({ plan: 'pro' })) {
        // Pro users have unlimited companions
        return true;
    } else if(has({ feature: "3_companion_limit" })) {
        limit = 3;
    } else if(has({ feature: "10_companion_limit" })) {
        limit = 10;
    }

    // Count user's existing companions
    const { data, error } = await supabase
        .from('companions')
        .select('id', { count: 'exact' })
        .eq('author', userId)

    // Handle query errors
    if(error) throw new Error(error.message);

    const companionCount = data?.length;

    // Check if user has reached their limit
    if(companionCount >= limit) {
        return false
    } else {
        return true;
    }
}

/**
 * ========================================
 * BOOKMARK MANAGEMENT FUNCTIONS
 * ========================================
 */

/**
 * Adds a companion to the user's bookmarks
 * 
 * @async
 * @function addBookmark
 * @param {string} companionId - The ID of the companion to bookmark
 * @param {string} path - The current page path for cache revalidation
 * @returns {Promise<any|undefined>} The created bookmark record or undefined if user not authenticated
 * @throws {Error} When bookmark creation fails
 * 
 * @example
 * await addBookmark("123e4567-e89b-12d3-a456-426614174000", "/companions");
 */
export const addBookmark = async (companionId: string, path: string) => {
  // Get authenticated user ID
  const { userId } = await auth();
  if (!userId) return;
  
  const supabase = createSupabaseClient();
  
  // Insert new bookmark record
  const { data, error } = await supabase.from("bookmarks").insert({
    companion_id: companionId,
    user_id: userId,
  });
  
  // Handle insertion errors
  if (error) {
    console.error('addBookmark error:', error);
    throw new Error(error.message);
  }
  
  // Revalidate the page cache to reflect changes
  revalidatePath(path);
  return data;
};

/**
 * Removes a companion from the user's bookmarks
 * 
 * @async
 * @function removeBookmark
 * @param {string} companionId - The ID of the companion to remove from bookmarks
 * @param {string} path - The current page path for cache revalidation
 * @returns {Promise<any|undefined>} The deletion result or undefined if user not authenticated
 * @throws {Error} When bookmark removal fails
 * 
 * @example
 * await removeBookmark("123e4567-e89b-12d3-a456-426614174000", "/companions");
 */
export const removeBookmark = async (companionId: string, path: string) => {
  // Get authenticated user ID
  const { userId } = await auth();
  if (!userId) return;
  
  const supabase = createSupabaseClient();
  
  // Delete the bookmark record matching companion and user
  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("companion_id", companionId)
    .eq("user_id", userId);
    
  // Handle deletion errors
  if (error) {
    console.error('removeBookmark error:', error);
    throw new Error(error.message);
  }
  
  // Revalidate the page cache to reflect changes
  revalidatePath(path);
  return data;
};

/**
 * Retrieves all companions that a user has bookmarked
 * 
 * @async
 * @function getBookmarkedCompanions
 * @param {string} userId - The ID of the user whose bookmarked companions to retrieve
 * @returns {Promise<Companion[]>} Array of bookmarked companions or empty array if none/error
 * 
 * @description
 * This function performs a two-step process:
 * 1. Fetch bookmark records for the user to get companion IDs
 * 2. Fetch the actual companion data using those IDs
 * 
 * @example
 * const bookmarkedCompanions = await getBookmarkedCompanions("user_123");
 * console.log(`User has ${bookmarkedCompanions.length} bookmarked companions`);
 */
export const getBookmarkedCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  
  try {
    // Step 1: Get the bookmarked companion IDs for this user
    const { data: bookmarks, error: bookmarkError } = await supabase
      .from("bookmarks")
      .select("companion_id")
      .eq("user_id", userId);
      
    // Handle bookmark query errors
    if (bookmarkError) {
      console.error('Bookmark error:', bookmarkError);
      return [];
    }
    
    // Return empty array if no bookmarks found
    if (!bookmarks || bookmarks.length === 0) {
      return [];
    }
    
    // Step 2: Get the actual companion data using the IDs
    const companionIds = bookmarks.map(bookmark => bookmark.companion_id);
    const { data: companions, error: companionError } = await supabase
      .from("companions")
      .select("*")
      .in("id", companionIds);
      
    // Handle companion query errors
    if (companionError) {
      console.error('Companion error:', companionError);
      return [];
    }
    
    // Return companions or empty array if none found
    return companions || [];
  } catch (error) {
    // Handle any unexpected errors
    console.error('getBookmarkedCompanions error:', error);
    return [];
  }
};
