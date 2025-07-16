// CSS class manipulation utilities
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
// Application constants for subjects and voices
import { subjectsColors, voices } from "@/constants";
// Vapi AI assistant configuration types
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

/**
 * Utility function for conditional CSS class merging
 * 
 * Combines clsx for conditional class handling with tailwind-merge
 * to resolve Tailwind CSS class conflicts intelligently.
 * 
 * @param {...ClassValue[]} inputs - Array of class values (strings, objects, arrays)
 * @returns {string} Merged and deduplicated CSS class string
 * 
 * @example
 * // Basic usage
 * cn('px-4', 'py-2', 'bg-blue-500')
 * // Returns: 'px-4 py-2 bg-blue-500'
 * 
 * @example
 * // Conditional classes
 * cn('base-class', { 'active-class': isActive, 'disabled-class': isDisabled })
 * 
 * @example
 * // Tailwind conflict resolution
 * cn('px-4', 'px-6') // Returns: 'px-6' (later class wins)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Retrieves the color associated with a specific subject
 * 
 * Maps subject names to their corresponding theme colors defined in constants.
 * Used for consistent color theming across companion cards and UI elements.
 * 
 * @param {string} subject - The subject name (e.g., 'Mathematics', 'Science')
 * @returns {string} Hex color code or color name for the subject
 * 
 * @example
 * getSubjectColor('Mathematics') // Returns: '#e3f2fd'
 * getSubjectColor('Science') // Returns: '#f3e5f5'
 */
export const getSubjectColor = (subject: string) => {
  return subjectsColors[subject as keyof typeof subjectsColors];
};

/**
 * Configures a Vapi AI assistant with specified voice and conversation style
 * 
 * Creates a comprehensive assistant configuration for real-time voice tutoring sessions.
 * Integrates multiple AI services:
 * - Deepgram for speech transcription
 * - ElevenLabs for voice synthesis
 * - OpenAI GPT-4 for conversation intelligence
 * 
 * @param {string} voice - Voice type identifier from constants
 * @param {string} style - Conversation style (e.g., 'friendly', 'professional')
 * @returns {CreateAssistantDTO} Complete Vapi assistant configuration object
 * 
 * @example
 * const assistant = configureAssistant('female', 'friendly');
 * // Returns configured assistant ready for voice session
 */
export const configureAssistant = (voice: string, style: string) => {
  // Get voice configuration from constants, fallback to 'sarah' if not found
  const voiceConfig = voices[voice as keyof typeof voices];
  const voiceId = voiceConfig?.[style as keyof typeof voiceConfig] || "sarah";

  // Complete Vapi assistant configuration
  const vapiAssistant: CreateAssistantDTO = {
    name: "Companion", // Assistant identifier
    
    // Initial greeting message with topic placeholder
    firstMessage:
        "Hello, let's start the session. Today we'll be talking about {{topic}}.",
    
    // Speech-to-text configuration using Deepgram
    transcriber: {
      provider: "deepgram", // Deepgram for high-accuracy transcription
      model: "nova-3", // Latest Deepgram model for best performance
      language: "en", // English language support
    },
    
    // Text-to-speech configuration using ElevenLabs
    voice: {
      provider: "11labs", // ElevenLabs for natural voice synthesis
      voiceId: voiceId, // Selected voice ID based on user preference
      stability: 0.4, // Voice stability (0-1, lower = more expressive)
      similarityBoost: 0.8, // Voice similarity enhancement (0-1)
      speed: 1, // Speech speed (0.25-4.0, 1 = normal)
      style: 0.5, // Voice style intensity (0-1)
      useSpeakerBoost: true, // Enhance speaker clarity
    },
    
    // AI model configuration using OpenAI GPT-4
    model: {
      provider: "openai", // OpenAI as the language model provider
      model: "gpt-4", // GPT-4 for advanced conversation capabilities
      
      // System prompt defining the assistant's role and behavior
      messages: [
        {
          role: "system",
          content: `You are a highly knowledgeable tutor teaching a real-time voice session with a student. Your goal is to teach the student about the topic and subject.

                    Tutor Guidelines:
                    Stick to the given topic - {{ topic }} and subject - {{ subject }} and teach the student about it.
                    Keep the conversation flowing smoothly while maintaining control.
                    From time to time make sure that the student is following you and understands you.
                    Break down the topic into smaller parts and teach the student one part at a time.
                    Keep your style of conversation {{ style }}.
                    Keep your responses short, like in a real voice conversation.
                    Do not include any special characters in your responses - this is a voice conversation.
              `,
        },
      ],
    },
    
    // Message arrays for client-server communication
    clientMessages: [], // Messages from client to assistant
    serverMessages: [], // Messages from server to assistant
  };
  
  return vapiAssistant;
};
