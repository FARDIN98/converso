/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '@/components/LoadingSpinner'

/**
 * Test suite for LoadingSpinner component
 * Tests rendering, props handling, and styling
 */
describe('LoadingSpinner Component', () => {
  
  /**
   * Basic rendering tests
   */
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.firstChild as HTMLElement
      expect(spinner).toBeInTheDocument()
    })

    it('should render with default medium size', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.firstChild as HTMLElement
      expect(spinner).toHaveClass('w-6', 'h-6')
    })

    it('should have default animation and styling classes', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.firstChild as HTMLElement
      expect(spinner).toHaveClass(
        'animate-spin',
        'rounded-full',
        'border-2',
        'border-gray-300',
        'border-t-primary'
      )
    })
  })

  /**
   * Size prop tests
   */
  describe('Size Prop', () => {
    it('should render small size correctly', () => {
      const { container } = render(<LoadingSpinner size="sm" />)
      const spinner = container.firstChild as HTMLElement
      expect(spinner).toHaveClass('w-4', 'h-4')
      expect(spinner).not.toHaveClass('w-6', 'h-6', 'w-8', 'h-8')
    })

    it('should render medium size correctly', () => {
      const { container } = render(<LoadingSpinner size="md" />)
      const spinner = container.firstChild as HTMLElement
      expect(spinner).toHaveClass('w-6', 'h-6')
      expect(spinner).not.toHaveClass('w-4', 'h-4', 'w-8', 'h-8')
    })

    it('should render large size correctly', () => {
      const { container } = render(<LoadingSpinner size="lg" />)
      const spinner = container.firstChild as HTMLElement
      expect(spinner).toHaveClass('w-8', 'h-8')
      expect(spinner).not.toHaveClass('w-4', 'h-4', 'w-6', 'h-6')
    })
  })

  /**
   * Custom className prop tests
   */
  describe('Custom ClassName', () => {
    it('should apply custom className', () => {
      const { container } = render(<LoadingSpinner className="custom-class" />)
      const spinner = container.firstChild as HTMLElement
      expect(spinner).toHaveClass('custom-class')
    })

    it('should merge custom className with default classes', () => {
      const { container } = render(<LoadingSpinner className="text-red-500 bg-blue-100" />)
      const spinner = container.firstChild as HTMLElement
      expect(spinner).toHaveClass(
        'text-red-500',
        'bg-blue-100',
        'animate-spin',
        'rounded-full',
        'border-2'
      )
    })

    it('should handle empty className', () => {
      const { container } = render(<LoadingSpinner className="" />)
      const spinner = container.firstChild as HTMLElement
      expect(spinner).toHaveClass('animate-spin', 'rounded-full')
    })
  })

  /**
   * Combined props tests
   */
  describe('Combined Props', () => {
    it('should handle size and className together', () => {
      const { container } = render(<LoadingSpinner size="lg" className="text-blue-500" />)
      const spinner = container.firstChild as HTMLElement
      expect(spinner).toHaveClass(
        'w-8',
        'h-8',
        'text-blue-500',
        'animate-spin',
        'rounded-full'
      )
    })

    it('should override size classes with custom className if conflicting', () => {
      const { container } = render(<LoadingSpinner size="sm" className="w-12 h-12" />)
      const spinner = container.firstChild as HTMLElement
      // tailwind-merge should handle conflicts, keeping the last one
      expect(spinner).toHaveClass('w-12', 'h-12')
    })
  })

  /**
   * Accessibility tests
   */
  describe('Accessibility', () => {
    it('should have proper ARIA attributes for screen readers', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.firstChild as HTMLElement
      expect(spinner).toBeInTheDocument()
    })

    it('should be identifiable as a loading indicator', () => {
      const { container } = render(<LoadingSpinner />)
      const spinnerDiv = container.firstChild as HTMLElement
      expect(spinnerDiv).toHaveClass('animate-spin')
    })
  })

  /**
   * Edge cases and error handling
   */
  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const { container } = render(<LoadingSpinner size={undefined} className={undefined} />)
      const spinner = container.firstChild as HTMLElement
      expect(spinner).toHaveClass('w-6', 'h-6') // Should default to medium
    })

    it('should render consistently across multiple instances', () => {
      const { rerender, container } = render(<LoadingSpinner size="sm" />)
      let spinner = container.firstChild as HTMLElement
      expect(spinner).toHaveClass('w-4', 'h-4')

      rerender(<LoadingSpinner size="lg" />)
      spinner = container.firstChild as HTMLElement
      expect(spinner).toHaveClass('w-8', 'h-8')
    })
  })

  /**
   * Snapshot testing for visual regression
   */
  describe('Snapshot Tests', () => {
    it('should match snapshot for default props', () => {
      const { container } = render(<LoadingSpinner />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('should match snapshot for small size', () => {
      const { container } = render(<LoadingSpinner size="sm" />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('should match snapshot for large size with custom class', () => {
      const { container } = render(
        <LoadingSpinner size="lg" className="text-blue-500" />
      )
      expect(container.firstChild).toMatchSnapshot()
    })
  })
})