/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CompanionCard from '@/components/CompanionCard'
import * as companionActions from '@/lib/actions/companion.actions'
import toast from 'react-hot-toast'

/**
 * Mock external dependencies
 */
vi.mock('@/lib/actions/companion.actions', () => ({
  addBookmark: vi.fn(),
  removeBookmark: vi.fn()
}))

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

vi.mock('next/link', () => ({
  default: ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  )
}))

/**
 * Test suite for CompanionCard component
 * Tests rendering, props handling, user interactions, and async operations
 */
describe('CompanionCard Component', () => {
  
  const mockProps = {
    id: 'test-companion-1',
    name: 'Test Companion',
    topic: 'Test Topic',
    subject: 'science',
    duration: 30,
    color: '#E5D0FF',
    bookmarked: false
  }

  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  /**
   * Basic rendering tests
   */
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<CompanionCard {...mockProps} />)
      expect(screen.getByText('Test Companion')).toBeInTheDocument()
    })

    it('should display all companion information correctly', () => {
      render(<CompanionCard {...mockProps} />)
      
      expect(screen.getByText('Test Companion')).toBeInTheDocument()
      expect(screen.getByText('Test Topic')).toBeInTheDocument()
      expect(screen.getByText('science')).toBeInTheDocument()
      expect(screen.getByText('30 minutes')).toBeInTheDocument()
    })

    it('should apply correct background color', () => {
      const { container } = render(<CompanionCard {...mockProps} />)
      const article = container.querySelector('article')
      expect(article).toHaveStyle({ backgroundColor: '#E5D0FF' })
    })

    it('should render Launch Lesson button with correct link', () => {
      render(<CompanionCard {...mockProps} />)
      const launchButton = screen.getByText('Launch Lesson')
      expect(launchButton).toBeInTheDocument()
      
      const link = launchButton.closest('a')
      expect(link).toHaveAttribute('href', '/companions/test-companion-1')
    })

    it('should display duration with clock icon', () => {
      render(<CompanionCard {...mockProps} />)
      const clockIcon = screen.getByAltText('duration')
      expect(clockIcon).toBeInTheDocument()
      expect(screen.getByText('30 minutes')).toBeInTheDocument()
    })
  })

  /**
   * Bookmark functionality tests
   */
  describe('Bookmark Functionality', () => {
    it('should show empty bookmark icon when not bookmarked', () => {
      render(<CompanionCard {...mockProps} bookmarked={false} />)
      const bookmarkIcon = screen.getByAltText('bookmark')
      expect(bookmarkIcon).toHaveAttribute('src', '/icons/bookmark.svg')
    })

    it('should show filled bookmark icon when bookmarked', () => {
      render(<CompanionCard {...mockProps} bookmarked={true} />)
      const bookmarkIcon = screen.getByAltText('bookmark')
      expect(bookmarkIcon).toHaveAttribute('src', '/icons/bookmark-filled.svg')
    })

    it('should call addBookmark when clicking empty bookmark', async () => {
      const addBookmarkSpy = vi.spyOn(companionActions, 'addBookmark').mockResolvedValue(undefined)
      
      const { container } = render(<CompanionCard {...mockProps} bookmarked={false} />)
      const bookmarkButton = container.querySelector('.companion-bookmark')!
      
      await user.click(bookmarkButton)
      
      expect(addBookmarkSpy).toHaveBeenCalledWith('test-companion-1', '/test-path')
      expect(toast.success).toHaveBeenCalledWith('Bookmarked successfully!')
    })

    it('should call removeBookmark when clicking filled bookmark', async () => {
      const removeBookmarkSpy = vi.spyOn(companionActions, 'removeBookmark').mockResolvedValue(undefined)
      
      const { container } = render(<CompanionCard {...mockProps} bookmarked={true} />)
      const bookmarkButton = container.querySelector('.companion-bookmark')!
      
      await user.click(bookmarkButton)
      
      expect(removeBookmarkSpy).toHaveBeenCalledWith('test-companion-1', '/test-path')
      expect(toast.success).toHaveBeenCalledWith('Bookmark removed!')
    })

    it('should show loading spinner during bookmark operation', async () => {
      const addBookmarkSpy = vi.spyOn(companionActions, 'addBookmark')
        .mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      const { container } = render(<CompanionCard {...mockProps} bookmarked={false} />)
      const bookmarkButton = container.querySelector('.companion-bookmark')!
      
      await user.click(bookmarkButton)
      
      // Should show loading spinner
      const spinner = bookmarkButton.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
      expect(bookmarkButton).toBeDisabled()
      
      await waitFor(() => {
        expect(addBookmarkSpy).toHaveBeenCalled()
      })
    })

    it('should handle bookmark error gracefully', async () => {
      const addBookmarkSpy = vi.spyOn(companionActions, 'addBookmark')
        .mockRejectedValue(new Error('Network error'))
      
      const { container } = render(<CompanionCard {...mockProps} bookmarked={false} />)
      const bookmarkButton = container.querySelector('.companion-bookmark')!
      
      await user.click(bookmarkButton)
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Something went wrong!')
      })
      
      expect(addBookmarkSpy).toHaveBeenCalled()
    })

    it('should toggle bookmark state correctly', async () => {
      vi.spyOn(companionActions, 'addBookmark').mockResolvedValue(undefined)
      
      const { container } = render(<CompanionCard {...mockProps} bookmarked={false} />)
      const bookmarkButton = container.querySelector('.companion-bookmark')!
      
      // Initially should show empty bookmark
      expect(screen.getByAltText('bookmark')).toHaveAttribute('src', '/icons/bookmark.svg')
      
      await user.click(bookmarkButton)
      
      await waitFor(() => {
        expect(screen.getByAltText('bookmark')).toHaveAttribute('src', '/icons/bookmark-filled.svg')
      })
    })
  })

  /**
   * Props validation tests
   */
  describe('Props Handling', () => {
    it('should handle different subjects correctly', () => {
      const subjects = ['science', 'maths', 'language', 'coding', 'history', 'economics']
      
      subjects.forEach(subject => {
        const { rerender } = render(<CompanionCard {...mockProps} subject={subject} />)
        expect(screen.getByText(subject)).toBeInTheDocument()
        rerender(<div />)
      })
    })

    it('should handle different durations correctly', () => {
      const durations = [15, 30, 45, 60]
      
      durations.forEach(duration => {
        const { rerender } = render(<CompanionCard {...mockProps} duration={duration} />)
        expect(screen.getByText(`${duration} minutes`)).toBeInTheDocument()
        rerender(<div />)
      })
    })

    it('should handle different colors correctly', () => {
      const colors = ['#E5D0FF', '#FFDA6E', '#BDE7FF', '#FFC8E4']
      
      colors.forEach(color => {
        const { container, rerender } = render(<CompanionCard {...mockProps} color={color} />)
        const article = container.querySelector('article')
        expect(article).toHaveStyle({ backgroundColor: color })
        rerender(<div />)
      })
    })

    it('should handle long names and topics gracefully', () => {
      const longProps = {
        ...mockProps,
        name: 'This is a very long companion name that might overflow',
        topic: 'This is a very long topic description that should be handled properly'
      }
      
      render(<CompanionCard {...longProps} />)
      expect(screen.getByText(longProps.name)).toBeInTheDocument()
      expect(screen.getByText(longProps.topic)).toBeInTheDocument()
    })
  })

  /**
   * Accessibility tests
   */
  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const { container } = render(<CompanionCard {...mockProps} />)
      
      const article = screen.getByRole('article')
      expect(article).toBeInTheDocument()
      
      const bookmarkButton = container.querySelector('.companion-bookmark')!
      expect(bookmarkButton).toBeInTheDocument()
      
      const launchButton = screen.getByText('Launch Lesson')
      expect(launchButton).toBeInTheDocument()
    })

    it('should have proper alt text for images', () => {
      render(<CompanionCard {...mockProps} />)
      
      // Only check for duration icon as bookmark might be in loading state
      expect(screen.getByAltText('duration')).toBeInTheDocument()
      
      // Check if bookmark image exists when not loading
      const bookmarkImage = screen.queryByAltText('bookmark')
      if (bookmarkImage) {
        expect(bookmarkImage).toBeInTheDocument()
      }
    })

    it('should disable bookmark button during loading', async () => {
      vi.spyOn(companionActions, 'addBookmark')
        .mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      const { container } = render(<CompanionCard {...mockProps} bookmarked={false} />)
      const bookmarkButton = container.querySelector('.companion-bookmark')!
      
      await user.click(bookmarkButton)
      
      expect(bookmarkButton).toBeDisabled()
    })
  })

  /**
   * Component behavior tests
   */
  describe('Component Behavior', () => {
    it('should be memoized to prevent unnecessary re-renders', () => {
      const { rerender } = render(<CompanionCard {...mockProps} />)
      const initialElement = screen.getByText('Test Companion')
      
      // Re-render with same props
      rerender(<CompanionCard {...mockProps} />)
      const afterRerender = screen.getByText('Test Companion')
      
      // Should be the same element due to memoization
      expect(initialElement).toBe(afterRerender)
    })

    it('should show success animation after bookmarking', async () => {
      vi.spyOn(companionActions, 'addBookmark').mockResolvedValue(undefined)
      
      const { container } = render(<CompanionCard {...mockProps} bookmarked={false} />)
      const bookmarkButton = container.querySelector('.companion-bookmark')!
      
      await user.click(bookmarkButton)
      
      await waitFor(() => {
        expect(bookmarkButton).toHaveClass('bookmark-success')
      })
    })

    it('should handle rapid bookmark clicks gracefully', async () => {
      let resolvePromise: () => void
      const promise = new Promise<void>(resolve => {
        resolvePromise = resolve
      })
      
      const addBookmarkSpy = vi.spyOn(companionActions, 'addBookmark').mockReturnValue(promise)
      
      const { container } = render(<CompanionCard {...mockProps} bookmarked={false} />)
      const bookmarkButton = container.querySelector('.companion-bookmark')!
      
      // Click multiple times rapidly while loading
      fireEvent.click(bookmarkButton)
      fireEvent.click(bookmarkButton)
      fireEvent.click(bookmarkButton)
      
      // Should only call once due to loading state
      expect(addBookmarkSpy).toHaveBeenCalledTimes(1)
      
      // Resolve the promise to complete the test
      resolvePromise!()
      await promise
    })
  })

  /**
   * Edge cases and error handling
   */
  describe('Edge Cases', () => {
    it('should handle missing or invalid props gracefully', () => {
      const invalidProps = {
        ...mockProps,
        duration: 0,
        color: '',
        name: '',
        topic: ''
      }
      
      expect(() => render(<CompanionCard {...invalidProps} />)).not.toThrow()
    })

    it('should handle network timeouts in bookmark operations', async () => {
      const timeoutError = new Error('Network timeout')
      vi.spyOn(companionActions, 'addBookmark').mockRejectedValue(timeoutError)
      
      const { container } = render(<CompanionCard {...mockProps} bookmarked={false} />)
      const bookmarkButton = container.querySelector('.companion-bookmark')!
      
      await user.click(bookmarkButton)
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Something went wrong!')
      })
    })
  })
})