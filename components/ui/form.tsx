"use client"

// React library for component creation and context management
import * as React from "react"
// Radix UI label primitive for accessible label functionality
import * as LabelPrimitive from "@radix-ui/react-label"
// Radix UI slot component for polymorphic rendering
import { Slot } from "@radix-ui/react-slot"
// React Hook Form components and types for form management
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

// Utility function for merging Tailwind CSS classes
import { cn } from "@/lib/utils"
// Custom label component
import { Label } from "@/components/ui/label"

/**
 * Form Component
 * 
 * Root form provider that wraps React Hook Form's FormProvider.
 * Provides form context to all child form components.
 */
const Form = FormProvider

/**
 * Type definition for FormField context value
 * 
 * @template TFieldValues - The form values type
 * @template TName - The field name type
 */
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName // The name of the form field
}

/**
 * React context for sharing form field information
 * between FormField and its child components
 */
const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

/**
 * FormField Component
 * 
 * A wrapper around React Hook Form's Controller that provides field context
 * to child components. This enables automatic field association and validation.
 * 
 * @template TFieldValues - The form values type
 * @template TName - The field name type
 * @param props - Controller props from React Hook Form
 * @returns JSX.Element - The form field with context provider
 * 
 * @example
 * ```tsx
 * <FormField
 *   control={form.control}
 *   name="email"
 *   render={({ field }) => (
 *     <FormItem>
 *       <FormLabel>Email</FormLabel>
 *       <FormControl>
 *         <Input {...field} />
 *       </FormControl>
 *     </FormItem>
 *   )}
 * />
 * ```
 */
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} /> {/* React Hook Form controller */}
    </FormFieldContext.Provider>
  )
}

/**
 * useFormField Hook
 * 
 * Custom hook that provides form field state and accessibility IDs.
 * Must be used within a FormField component to access field context.
 * 
 * Features:
 * - Field validation state
 * - Accessibility ID generation
 * - Error state management
 * - Field name and value access
 * 
 * @returns Object containing field state and accessibility IDs
 * @throws Error if used outside of FormField context
 * 
 * @example
 * ```tsx
 * const { error, formItemId } = useFormField()
 * ```
 */
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext) // Get field name from context
  const itemContext = React.useContext(FormItemContext) // Get item ID from context
  const { getFieldState } = useFormContext() // React Hook Form context
  const formState = useFormState({ name: fieldContext.name }) // Current form state
  const fieldState = getFieldState(fieldContext.name, formState) // Field-specific state

  // Ensure hook is used within proper context
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    // Generate accessibility IDs for form elements
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState, // Include validation state (error, invalid, etc.)
  }
}

/**
 * Type definition for FormItem context value
 */
type FormItemContextValue = {
  id: string // Unique identifier for the form item
}

/**
 * React context for sharing form item ID
 * between FormItem and its child components
 */
const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

/**
 * FormItem Component
 * 
 * Container component for form fields that provides unique ID context
 * and consistent spacing. Groups related form elements together.
 * 
 * Features:
 * - Automatic unique ID generation
 * - Grid layout with consistent gap
 * - Context provider for child components
 * 
 * @param className - Additional CSS classes to apply
 * @param props - Standard div element props
 * @returns JSX.Element - The form item container
 */
function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId() // Generate unique ID for accessibility

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item" // Data attribute for styling identification
        className={cn("grid gap-2", className)} // Grid layout with spacing
        {...props}
      />
    </FormItemContext.Provider>
  )
}

/**
 * FormLabel Component
 * 
 * Label component specifically designed for form fields.
 * Automatically associates with form controls and shows error states.
 * 
 * Features:
 * - Automatic form field association
 * - Error state styling
 * - Accessibility compliance
 * - Consistent label styling
 * 
 * @param className - Additional CSS classes to apply
 * @param props - All props from Radix UI LabelPrimitive.Root
 * @returns JSX.Element - The form label element
 */
function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField() // Get field state and IDs

  return (
    <Label
      data-slot="form-label" // Data attribute for styling identification
      data-error={!!error} // Error state for conditional styling
      className={cn("data-[error=true]:text-destructive", className)} // Error styling
      htmlFor={formItemId} // Associate label with form control
      {...props}
    />
  )
}

/**
 * FormControl Component
 * 
 * Wrapper component for form input elements that provides proper
 * accessibility attributes and error state management.
 * 
 * Features:
 * - Automatic accessibility attributes
 * - Error state indication
 * - Description and error message association
 * - Polymorphic rendering via Slot
 * 
 * @param props - All props from Radix UI Slot component
 * @returns JSX.Element - The form control wrapper
 */
function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control" // Data attribute for styling identification
      id={formItemId} // Unique ID for label association
      // Associate with description and error message for screen readers
      aria-describedby={
        !error
          ? `${formDescriptionId}` // Only description when no error
          : `${formDescriptionId} ${formMessageId}` // Include error message when present
      }
      aria-invalid={!!error} // Indicate validation state
      {...props}
    />
  )
}

/**
 * FormDescription Component
 * 
 * Helper text component that provides additional information about a form field.
 * Automatically associated with form controls for accessibility.
 * 
 * Features:
 * - Automatic accessibility association
 * - Consistent helper text styling
 * - Screen reader support
 * 
 * @param className - Additional CSS classes to apply
 * @param props - Standard paragraph element props
 * @returns JSX.Element - The form description element
 */
function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField() // Get description ID from context

  return (
    <p
      data-slot="form-description" // Data attribute for styling identification
      id={formDescriptionId} // ID for aria-describedby association
      className={cn("text-muted-foreground text-sm", className)} // Muted styling
      {...props}
    />
  )
}

/**
 * FormMessage Component
 * 
 * Error message component that displays validation errors or custom messages.
 * Automatically shows/hides based on field validation state.
 * 
 * Features:
 * - Automatic error message display
 * - Custom message support
 * - Conditional rendering
 * - Accessibility compliance
 * - Error styling
 * 
 * @param className - Additional CSS classes to apply
 * @param props - Standard paragraph element props
 * @returns JSX.Element | null - The form message element or null if no message
 */
function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField() // Get error state and message ID
  // Use error message if present, otherwise use children
  const body = error ? String(error?.message ?? "") : props.children

  // Don't render if no message to display
  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message" // Data attribute for styling identification
      id={formMessageId} // ID for aria-describedby association
      className={cn("text-destructive text-sm", className)} // Error styling
      {...props}
    >
      {body} {/* Error message or custom content */}
    </p>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
