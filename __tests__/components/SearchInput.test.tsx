/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import SearchInput from '@/components/SearchInput'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}))

// Mock @jsmastery/utils
vi.mock('@jsmastery/utils', () => ({
  formUrlQuery: vi.fn(),
  removeKeysFromUrlQuery: vi.fn(),
}))

const mockPush = vi.fn()
const mockGet = vi.fn()
const mockToString = vi.fn()

describe('SearchInput Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
    
    // Setup default mocks
    ;(usePathname as any).mockReturnValue('/companions')
    ;(useRouter as any).mockReturnValue({ push: mockPush })
    ;(useSearchParams as any).mockReturnValue({
      get: mockGet,
      toString: mockToString,
    })
    
    mockGet.mockReturnValue('')
    mockToString.mockReturnValue('')
    mockPush.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Rendering', () => {
    it('should render search input with placeholder', () => {
      render(<SearchInput />)
      
      expect(screen.getByPlaceholderText('Search companions...')).toBeInTheDocument()
      expect(screen.getByAltText('search')).toBeInTheDocument()
    })

    it('should render with proper structure', () => {
      const { container } = render(<SearchInput />)
      
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('relative', 'border', 'border-black', 'rounded-lg')
      
      const input = screen.getByPlaceholderText('Search companions...')
      expect(input).toHaveClass('outline-none')
    })
  })

  describe('Search Functionality', () => {
    it('should update input value when typing', () => {
      render(<SearchInput />)
      
      const input = screen.getByPlaceholderText('Search companions...')
      fireEvent.change(input, { target: { value: 'test search' } })
      
      expect(input).toHaveValue('test search')
    })

    it('should initialize with query from URL params', () => {
      mockGet.mockReturnValue('initial query')
      
      render(<SearchInput />)
      
      expect(mockGet).toHaveBeenCalledWith('topic')
    })
  })

  describe('Debounced Search', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    it('should debounce search input and update URL', () => {
      vi.useFakeTimers()
      render(<SearchInput />)
      
      const input = screen.getByPlaceholderText('Search companions...')
      
      fireEvent.change(input, { target: { value: 'test' } })
      
      // Should not call immediately
      expect(mockPush).not.toHaveBeenCalled()
      
      // Wait for debounce
      vi.advanceTimersByTime(500)
      
      // Should have called push after debounce
      expect(mockPush).toHaveBeenCalledTimes(1)
    })

    it('should remove topic from URL when search is cleared', () => {
      vi.useFakeTimers()
      render(<SearchInput />)
      
      const input = screen.getByPlaceholderText('Search companions...')
      
      // First add some text
      fireEvent.change(input, { target: { value: 'test' } })
      vi.advanceTimersByTime(500)
      
      // Clear previous calls
      mockPush.mockClear()
      
      // Then clear it
      fireEvent.change(input, { target: { value: '' } })
      vi.advanceTimersByTime(500)
      
      // Should call push to remove topic from URL
      expect(mockPush).toHaveBeenCalledTimes(1)
    })

    it('should not remove keys when not on companions page', () => {
      ;(usePathname as any).mockReturnValue('/other-page')
      
      vi.useFakeTimers()
      render(<SearchInput />)
      
      const input = screen.getByPlaceholderText('Search companions...')
      fireEvent.change(input, { target: { value: '' } })
      vi.advanceTimersByTime(500)
      
      // Should not call removeKeysFromUrlQuery on non-companions page
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should handle rapid typing correctly', () => {
      vi.useFakeTimers()
      render(<SearchInput />)
      
      const input = screen.getByPlaceholderText('Search companions...')
      
      // Clear any initial calls
      mockPush.mockClear()
      
      // Type rapidly without advancing timers between changes
      fireEvent.change(input, { target: { value: 't' } })
      fireEvent.change(input, { target: { value: 'te' } })
      fireEvent.change(input, { target: { value: 'test' } })
      fireEvent.change(input, { target: { value: 'final' } })
      
      // Should not call until debounce period
      expect(mockPush).not.toHaveBeenCalled()
      
      // Complete the debounce
      vi.advanceTimersByTime(500)
      
      // Should have called push only once with final value
      expect(mockPush).toHaveBeenCalledTimes(1)
    })
  })

  describe('URL Integration', () => {
    it('should work with existing search params', async () => {
      mockToString.mockReturnValue('subject=math&page=2')
      const { formUrlQuery } = await import('@jsmastery/utils')
      ;(formUrlQuery as any).mockReturnValue('/companions?subject=math&page=2&topic=test')
      
      vi.useFakeTimers()
      render(<SearchInput />)
      
      const input = screen.getByPlaceholderText('Search companions...')
      fireEvent.change(input, { target: { value: 'test' } })
      vi.advanceTimersByTime(500)
      
      expect(formUrlQuery).toHaveBeenCalledWith({
        params: 'subject=math&page=2',
        key: 'topic',
        value: 'test',
      })
    })

    it('should handle special characters in search', async () => {
      const { formUrlQuery } = await import('@jsmastery/utils')
      ;(formUrlQuery as any).mockReturnValue('/companions?topic=test%20%26%20more')
      
      vi.useFakeTimers()
      render(<SearchInput />)
      
      const input = screen.getByPlaceholderText('Search companions...')
      fireEvent.change(input, { target: { value: 'test & more' } })
      vi.advanceTimersByTime(500)
      
      expect(formUrlQuery).toHaveBeenCalledWith({
        params: '',
        key: 'topic',
        value: 'test & more',
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty initial query gracefully', () => {
      mockGet.mockReturnValue(null)
      
      render(<SearchInput />)
      
      const input = screen.getByPlaceholderText('Search companions...')
      expect(input).toHaveValue('')
    })

    it('should handle whitespace-only search', async () => {
      const { removeKeysFromUrlQuery } = await import('@jsmastery/utils')
      ;(removeKeysFromUrlQuery as any).mockReturnValue('/companions')
      
      vi.useFakeTimers()
      render(<SearchInput />)
      
      const input = screen.getByPlaceholderText('Search companions...')
      fireEvent.change(input, { target: { value: '   ' } })
      vi.advanceTimersByTime(500)
      
      // Whitespace should be treated as empty and trigger URL cleanup
      expect(removeKeysFromUrlQuery).toHaveBeenCalledWith({
        params: '',
        keysToRemove: ['topic'],
      })
    })

    it('should not crash on component unmount', () => {
      const { unmount } = render(<SearchInput />)
      
      // Should unmount without errors
      expect(() => unmount()).not.toThrow()
    })
  })

  describe('Accessibility', () => {
    it('should have proper input attributes', () => {
      render(<SearchInput />)
      
      const input = screen.getByPlaceholderText('Search companions...')
      expect(input).toHaveAttribute('placeholder', 'Search companions...')
      expect(input).toHaveClass('outline-none')
    })

    it('should have search icon with proper alt text', () => {
      render(<SearchInput />)
      
      const searchIcon = screen.getByAltText('search')
      expect(searchIcon).toBeInTheDocument()
      expect(searchIcon).toHaveAttribute('src', '/icons/search.svg')
    })
  })
})