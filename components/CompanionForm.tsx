/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

// Form validation and handling
import { zodResolver } from "@hookform/resolvers/zod" // Zod resolver for react-hook-form
import { useForm } from "react-hook-form" // React hook for form management
import { z } from "zod" // Schema validation library

// UI Components
import { Button } from "@/components/ui/button" // Styled button component
import {
    Form, // Form wrapper component
    FormControl, // Form control wrapper
    FormDescription, // Form field description
    FormField, // Individual form field
    FormItem, // Form item container
    FormLabel, // Form field label
    FormMessage, // Form validation message
} from "@/components/ui/form"
import { Input } from "@/components/ui/input" // Text input component
import {
    Select, // Select dropdown component
    SelectContent, // Select dropdown content
    SelectItem, // Individual select option
    SelectTrigger, // Select trigger button
    SelectValue, // Selected value display
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea" // Multi-line text input

// Data and Actions
import { subjects } from "@/constants" // Available subject options
import { createCompanion } from "@/lib/actions/companion.actions" // Server action to create companion
import { redirect } from "next/navigation" // Next.js navigation utility

/**
 * Zod schema for companion form validation
 * Defines the structure and validation rules for creating a new AI companion
 * 
 * @property {string} name - Companion's display name (required, min 1 character)
 * @property {string} subject - Academic subject area (required, from predefined list)
 * @property {string} topic - Specific topic or area of focus (required, min 1 character)
 * @property {string} voice - Voice type for speech synthesis (required, 'male' or 'female')
 * @property {string} style - Conversation style (required, 'formal' or 'casual')
 * @property {number} duration - Estimated session duration in minutes (required, min 1)
 */
const formSchema = z.object({
    name: z.string().min(1, { message: 'Companion is required.'}), // Companion display name
    subject: z.string().min(1, { message: 'Subject is required.'}), // Academic subject
    topic: z.string().min(1, { message: 'Topic is required.'}), // Specific learning topic
    voice: z.string().min(1, { message: 'Voice is required.'}), // Voice type (male/female)
    style: z.string().min(1, { message: 'Style is required.'}), // Conversation style
    duration: z.coerce.number().min(1, { message: 'Duration is required.'}), // Session duration
})

/**
 * CompanionForm Component
 * 
 * A comprehensive form for creating AI learning companions with customizable parameters.
 * Users can specify the companion's name, subject area, learning topic, voice type,
 * conversation style, and estimated session duration.
 * 
 * @component
 * @returns {JSX.Element} The companion creation form
 * 
 * @features
 * - Form validation using Zod schema
 * - Subject selection from predefined list
 * - Voice and style customization
 * - Duration estimation for sessions
 * - Automatic redirect after successful creation
 * - Error handling and user feedback
 * 
 * @example
 * ```tsx
 * <CompanionForm />
 * ```
 * 
 * @workflow
 * 1. User fills out companion details
 * 2. Form validates input using Zod schema
 * 3. On submit, creates companion via server action
 * 4. Redirects to companion detail page on success
 * 5. Shows error message and redirects home on failure
 */
const CompanionForm = () => {
    // Initialize form with validation schema and default values
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), // Use Zod for validation
        defaultValues: {
            name: '', // Empty companion name
            subject: '', // No subject selected
            topic: '', // Empty topic description
            voice: '', // No voice type selected
            style: '', // No conversation style selected
            duration: 15, // Default 15-minute session
        },
    })

    /**
     * Handles form submission and companion creation
     * 
     * @param {z.infer<typeof formSchema>} values - Validated form data
     * @returns {Promise<void>} Redirects to companion page or home
     */
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // Create companion using server action
        const companion = await createCompanion(values);

        if(companion) {
            // Success: redirect to the new companion's detail page
            redirect(`/companions/${companion.id}`);
        } else {
            // Failure: log error and redirect to home page
            console.log('Failed to create a companion');
            redirect('/');
        }
    }

    return (
        // Form wrapper with react-hook-form integration
        <Form {...form}>
            {/* Main form element with submit handler and spacing */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Companion Name Field */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Companion name</FormLabel>
                            <FormControl>
                                {/* Text input for companion's display name */}
                                <Input
                                    placeholder="Enter the companion name"
                                    {...field}
                                    className="input"
                                />
                            </FormControl>
                            {/* Validation error message */}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Subject Selection Field */}
                <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                                {/* Dropdown for selecting academic subject */}
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="input capitalize">
                                        <SelectValue placeholder="Select the subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Map through available subjects from constants */}
                                        {subjects.map((subject) => (
                                            <SelectItem
                                                value={subject}
                                                key={subject}
                                                className="capitalize"
                                            >
                                                {subject}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            {/* Validation error message */}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Topic Description Field */}
                <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>What should the companion help with?</FormLabel>
                            <FormControl>
                                {/* Multi-line text area for detailed topic description */}
                                <Textarea
                                    placeholder="Ex. Derivates & Integrals"
                                    {...field}
                                    className="input"
                                />
                            </FormControl>
                            {/* Validation error message */}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Voice Type Selection Field */}
                <FormField
                    control={form.control}
                    name="voice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Voice</FormLabel>
                            <FormControl>
                                {/* Dropdown for selecting voice type (male/female) */}
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="input">
                                        <SelectValue
                                            placeholder="Select the voice"
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Male voice option */}
                                        <SelectItem value="male">
                                            Male
                                        </SelectItem>
                                        {/* Female voice option */}
                                        <SelectItem value="female">
                                            Female
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            {/* Validation error message */}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Conversation Style Selection Field */}
                <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Style</FormLabel>
                            <FormControl>
                                {/* Dropdown for selecting conversation style */}
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="input">
                                        <SelectValue
                                            placeholder="Select the style"
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Formal conversation style */}
                                        <SelectItem value="formal">
                                            Formal
                                        </SelectItem>
                                        {/* Casual conversation style */}
                                        <SelectItem value="casual">
                                            Casual
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            {/* Validation error message */}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Session Duration Field */}
                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estimated session duration in minutes</FormLabel>
                            <FormControl>
                                {/* Number input for session duration */}
                                <Input
                                    type="number"
                                    placeholder="15"
                                    {...field}
                                    className="input"
                                />
                            </FormControl>
                            {/* Validation error message */}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Submit button to create the companion */}
                <Button type="submit" className="w-full cursor-pointer">Build Your Companion</Button>
            </form>
        </Form>
    )
}

export default CompanionForm
