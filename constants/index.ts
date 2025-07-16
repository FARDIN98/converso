/**
 * Available subject categories for educational companions
 * 
 * These subjects are used throughout the application for:
 * - Filtering companions by subject
 * - Color theming
 * - Search functionality
 * - Analytics and categorization
 */
export const subjects = [
  "maths",      // Mathematics and numerical topics
  "language",   // Language arts, literature, and linguistics
  "science",    // Natural sciences, physics, chemistry, biology
  "history",    // Historical events, periods, and analysis
  "coding",     // Programming, computer science, and software development
  "economics",  // Economic theory, markets, and financial concepts
];

/**
 * Color mapping for different subjects
 * 
 * Each subject has a unique color theme used for:
 * - Companion card backgrounds
 * - UI theming and visual consistency
 * - Subject identification at a glance
 * - Accessibility through color coding
 * 
 * Colors are chosen to be:
 * - Visually distinct from each other
 * - Accessible with good contrast
 * - Pleasant and engaging for users
 */
export const subjectsColors = {
  science: "#E5D0FF",    // Light purple - represents innovation and discovery
  maths: "#FFDA6E",     // Warm yellow - represents logic and clarity
  language: "#BDE7FF",  // Light blue - represents communication and flow
  coding: "#FFC8E4",    // Light pink - represents creativity and problem-solving
  history: "#FFECC8",   // Light orange - represents warmth and tradition
  economics: "#C8FFDF", // Light green - represents growth and prosperity
};

/**
 * Voice configuration for AI assistants
 * 
 * Maps voice types and styles to ElevenLabs voice IDs.
 * Used by the configureAssistant function to set up voice synthesis.
 * 
 * Structure:
 * - Gender-based categorization (male/female)
 * - Style variations (casual/formal) for each gender
 * - ElevenLabs voice IDs for each combination
 * 
 * Voice IDs correspond to specific trained voices in ElevenLabs:
 * - Each ID represents a unique voice with distinct characteristics
 * - Casual voices are more conversational and relaxed
 * - Formal voices are more professional and structured
 */
export const voices = {
  male: { 
    casual: "2BJW5coyhAzSr8STdHbE", // Male casual voice - friendly and approachable
    formal: "c6SfcYrb2t09NHXiT80T"  // Male formal voice - professional and clear
  },
  female: { 
    casual: "ZIlrSGI4jZqobxRKprJz", // Female casual voice - warm and engaging
    formal: "sarah"                  // Female formal voice - clear and authoritative
  },
};

/**
 * Sample data for recent learning sessions
 * 
 * This array contains mock data representing recent educational sessions
 * with AI companions. Used for:
 * - Demonstrating the application's functionality
 * - Populating the recent sessions section
 * - Testing and development purposes
 * - Showcasing different subjects and companion personalities
 * 
 * Each session object contains:
 * - id: Unique identifier for the session
 * - subject: Subject category (matches subjects array)
 * - name: Companion's personality name
 * - topic: Specific learning topic covered
 * - duration: Session length in minutes
 * - color: Theme color (matches subjectsColors)
 */
export const recentSessions = [
  {
    id: "1",
    subject: "science",
    name: "Neura the Brainy Explorer",        // Science companion with exploration theme
    topic: "Neural Network of the Brain",     // Advanced neuroscience topic
    duration: 45,                             // Longer session for complex topic
    color: "#E5D0FF",                         // Purple theme for science
  },
  {
    id: "2",
    subject: "maths",
    name: "Countsy the Number Wizard",        // Math companion with magical theme
    topic: "Derivatives & Integrals",         // Calculus topic
    duration: 30,                             // Standard session length
    color: "#FFDA6E",                         // Yellow theme for mathematics
  },
  {
    id: "3",
    subject: "language",
    name: "Verba the Vocabulary Builder",     // Language companion focused on words
    topic: "English Literature",              // Literature analysis topic
    duration: 30,                             // Standard session for reading
    color: "#BDE7FF",                         // Blue theme for language arts
  },
  {
    id: "4",
    subject: "coding",
    name: "Codey the Logic Hacker",           // Programming companion with tech theme
    topic: "Intro to If-Else Statements",     // Basic programming concept
    duration: 45,                             // Longer session for hands-on coding
    color: "#FFC8E4",                         // Pink theme for coding
  },
  {
    id: "5",
    subject: "history",
    name: "Memo, the Memory Keeper",          // History companion focused on remembering
    topic: "World Wars: Causes & Consequences", // Major historical event
    duration: 15,                             // Shorter session for overview
    color: "#FFECC8",                         // Orange theme for history
  },
  {
    id: "6",
    subject: "economics",
    name: "The Market Maestro",               // Economics companion with market expertise
    topic: "The Basics of Supply & Demand",   // Fundamental economic concept
    duration: 10,                             // Brief session for basic concept
    color: "#C8FFDF",                         // Green theme for economics
  },
];
