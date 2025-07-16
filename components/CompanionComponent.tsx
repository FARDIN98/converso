/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

/**
 * React hooks for state management, lifecycle, refs, memoization, and callbacks
 */
import {useEffect, useRef, useState, memo, useCallback} from 'react'

/**
 * Utility functions for class names, assistant configuration, and subject colors
 */
import {cn, configureAssistant, getSubjectColor} from "@/lib/utils";

/**
 * VAPI SDK for voice AI integration and call management
 */
import {vapi} from "@/lib/vapi.sdk";

/**
 * Next.js optimized image component
 */
import Image from "next/image";

/**
 * Lottie React for animations and its ref type
 */
import Lottie, {LottieRefCurrentProps} from "lottie-react";

/**
 * Soundwave animation data for visual feedback during speech
 */
import soundwaves from '@/constants/soundwaves.json'

/**
 * Server action for adding sessions to user history
 */
import {addToSessionHistory} from "@/lib/actions/companion.actions";

/**
 * Enum representing the different states of a voice call session
 * @enum {string} CallStatus
 * @property {string} INACTIVE - Call has not started yet
 * @property {string} CONNECTING - Call is being established
 * @property {string} ACTIVE - Call is in progress
 * @property {string} FINISHED - Call has ended
 */
enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

/**
 * CompanionComponent
 * 
 * An interactive voice AI companion component that enables real-time voice conversations
 * between users and AI tutors. Features voice recognition, speech synthesis, live
 * transcription, and visual feedback through animations.
 * 
 * Features:
 * - Real-time voice conversation with AI companions
 * - Live transcription display with role-based styling
 * - Visual feedback with Lottie animations during speech
 * - Microphone mute/unmute functionality
 * - Call status management (inactive, connecting, active, finished)
 * - Session history tracking
 * - Responsive design with mobile optimization
 * - Dynamic subject-based styling
 * 
 * @component
 * @param {CompanionComponentProps} props - Component props
 * @param {string} props.companionId - Unique identifier for the companion
 * @param {string} props.subject - Subject category for styling and context
 * @param {string} props.topic - Conversation topic for the AI assistant
 * @param {string} props.name - Display name of the AI companion
 * @param {string} props.userName - Name of the current user
 * @param {string} props.userImage - Profile image URL of the user
 * @param {string} props.style - Teaching style for the AI companion
 * @param {string} props.voice - Voice configuration for speech synthesis
 * @returns {JSX.Element} Rendered companion interaction interface
 * 
 * @example
 * ```tsx
 * <CompanionComponent
 *   companionId="comp_123"
 *   subject="science"
 *   topic="Photosynthesis"
 *   name="Dr. Sarah"
 *   userName="John Doe"
 *   userImage="/images/user.jpg"
 *   style="encouraging"
 *   voice="female_voice_1"
 * />
 * ```
 */
const CompanionComponent = memo(({ companionId, subject, topic, name, userName, userImage, style, voice }: CompanionComponentProps) => {
    // Current status of the voice call session
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    
    // Whether the AI companion is currently speaking
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    // Whether the user's microphone is muted
    const [isMuted, setIsMuted] = useState(false);
    
    // Array of conversation messages for transcript display
    const [messages, setMessages] = useState<SavedMessage[]>([]);

    // Reference to the Lottie animation component for controlling playback
    const lottieRef = useRef<LottieRefCurrentProps>(null);

    /**
     * Effect to control Lottie animation based on speaking state
     * Plays animation when AI is speaking, stops when silent
     */
    useEffect(() => {
        if(lottieRef) {
            if(isSpeaking) {
                // Start soundwave animation when AI is speaking
                lottieRef.current?.play()
            } else {
                // Stop animation when AI is not speaking
                lottieRef.current?.stop()
            }
        }
    }, [isSpeaking, lottieRef])

    /**
     * Effect to set up VAPI event listeners for call management
     * Handles call lifecycle, messages, speech events, and errors
     */
    useEffect(() => {
        // Event handler for when call successfully starts
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

        // Event handler for when call ends - updates status and saves session
        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
            // Add this session to user's learning history
            addToSessionHistory(companionId)
        }

        // Event handler for processing incoming messages and transcripts
        const onMessage = (message: Message) => {
            // Only process final transcripts to avoid duplicate partial messages
            if(message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage= { role: message.role, content: message.transcript}
                // Add new message to the beginning of the array for reverse chronological order
                setMessages((prev) => [newMessage, ...prev])
            }
        }

        // Event handlers for speech state management
        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        // Error handler for VAPI errors
        const onError = (error: Error) => console.log('Error', error);

        // Register all event listeners
        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('error', onError);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);

        // Cleanup function to remove event listeners on unmount
        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('error', onError);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
        }
    }, [companionId]);

    /**
     * Toggles the microphone mute state
     * Updates both VAPI mute state and local component state
     */
    const toggleMicrophone = useCallback(() => {
        const isMuted = vapi.isMuted();
        // Toggle mute state in VAPI
        vapi.setMuted(!isMuted);
        // Update local state to reflect the change
        setIsMuted(!isMuted)
    }, []);

    /**
     * Initiates a voice call session with the AI companion
     * Configures the assistant with subject, topic, and style parameters
     */
    const handleCall = useCallback(async () => {
        // Set status to connecting while call is being established
        setCallStatus(CallStatus.CONNECTING)

        // Configure assistant parameters for this specific conversation
        const assistantOverrides = {
            variableValues: { subject, topic, style }, // Pass conversation context
            clientMessages: ["transcript"], // Request transcript messages
            serverMessages: [], // No server messages needed
        }

        // Start the VAPI call with configured assistant and overrides
        // @ts-expect-error - VAPI types may not be fully compatible
        vapi.start(configureAssistant(voice, style), assistantOverrides)
    }, [subject, topic, style, voice]);

    /**
     * Ends the current voice call session
     * Updates call status and stops VAPI connection
     */
    const handleDisconnect = useCallback(() => {
        // Update status to finished
        setCallStatus(CallStatus.FINISHED)
        // Stop the VAPI call
        vapi.stop()
    }, []);

    return (
        /* Main container for the companion interface */
        <section className="flex flex-col h-[70vh]">
            {/* Top section with companion and user avatars */}
            <section className="flex gap-8 max-sm:flex-col">
                {/* Companion avatar and controls section */}
                <div className="companion-section">
                    {/* Companion avatar with dynamic background color based on subject */}
                    <div className="companion-avatar" style={{ backgroundColor: getSubjectColor(subject)}}>
                        {/* Static subject icon - shown when inactive/finished/connecting */}
                        <div
                            className={
                            cn(
                                'absolute transition-opacity duration-1000', callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-1001' : 'opacity-0', callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse'
                            )
                        }>
                            <Image src={`/icons/${subject}.svg`} alt={subject} width={150} height={150} className="max-sm:w-fit" />
                        </div>

                        {/* Animated soundwave - shown when call is active */}
                        <div className={cn('absolute transition-opacity duration-1000', callStatus === CallStatus.ACTIVE ? 'opacity-100': 'opacity-0')}>
                            <Lottie
                                lottieRef={lottieRef}
                                animationData={soundwaves}
                                autoplay={false}
                                className="companion-lottie"
                            />
                        </div>
                    </div>
                    {/* Companion name display */}
                    <p className="font-bold text-2xl">{name}</p>
                </div>

                {/* User section with avatar and controls */}
                <div className="user-section">
                    {/* User avatar and name */}
                    <div className="user-avatar">
                        <Image src={userImage} alt={userName} width={130} height={130} className="rounded-lg" />
                        <p className="font-bold text-2xl">
                            {userName}
                        </p>
                    </div>
                    {/* Microphone toggle button - only active during call */}
                    <button className="btn-mic" onClick={toggleMicrophone} disabled={callStatus !== CallStatus.ACTIVE}>
                        {/* Dynamic microphone icon based on mute state */}
                        <Image src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'} alt="mic" width={36} height={36} />
                        <p className="max-sm:hidden">
                            {isMuted ? 'Turn on microphone' : 'Turn off microphone'}
                        </p>
                    </button>
                    {/* Main call control button - changes based on call status */}
                    <button className={cn('rounded-lg py-2 cursor-pointer transition-colors w-full text-white', callStatus ===CallStatus.ACTIVE ? 'bg-red-700' : 'bg-primary', callStatus === CallStatus.CONNECTING && 'animate-pulse')} onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}>
                        {/* Dynamic button text based on call status */}
                        {callStatus === CallStatus.ACTIVE
                        ? "End Session"
                        : callStatus === CallStatus.CONNECTING
                            ? 'Connecting'
                        : 'Start Session'
                        }
                    </button>
                </div>
            </section>

            {/* Transcript section for displaying conversation history */}
            <section className="transcript">
                {/* Scrollable message container */}
                <div className="transcript-message no-scrollbar">
                    {/* Render each message with role-based styling */}
                    {messages.map((message, index) => {
                        if(message.role === 'assistant') {
                            return (
                                /* Assistant message with companion name */
                                <p key={index} className="max-sm:text-sm">
                                    {
                                        name
                                            .split(' ')[0]
                                            .replace(/[.,]/g, '')
                                    }: {message.content}
                                </p>
                            )
                        } else {
                           /* User message with primary color styling */
                           return <p key={index} className="text-primary max-sm:text-sm">
                                {userName}: {message.content}
                            </p>
                        }
                    })}
                </div>

                {/* Fade effect at bottom of transcript */}
                <div className="transcript-fade" />
            </section>
        </section>
    );
});

CompanionComponent.displayName = 'CompanionComponent';

export default CompanionComponent
