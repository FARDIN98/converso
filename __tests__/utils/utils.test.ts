/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi } from 'vitest'
import { cn, getSubjectColor, configureAssistant } from '@/lib/utils'
import { subjectsColors, voices } from '@/constants'

/**
 * Test suite for utility functions
 * Tests all utility functions with various scenarios including edge cases
 */
describe('Utils Functions', () => {
  
  /**
   * Test cn function (className utility)
   * Tests the combination of clsx and tailwind-merge functionality
   */
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      const result = cn('px-4', 'py-2', 'bg-blue-500')
      expect(result).toBe('px-4 py-2 bg-blue-500')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toBe('base-class active-class')
    })

    it('should handle false conditions', () => {
      const isActive = false
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toBe('base-class')
    })

    it('should merge conflicting Tailwind classes', () => {
      const result = cn('px-4 px-6')
      expect(result).toBe('px-6') // tailwind-merge should keep the last one
    })

    it('should handle empty inputs', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle null and undefined values', () => {
      const result = cn('valid-class', null, undefined, 'another-class')
      expect(result).toBe('valid-class another-class')
    })
  })

  /**
   * Test getSubjectColor function
   * Tests color retrieval for different subjects
   */
  describe('getSubjectColor function', () => {
    it('should return correct color for valid subjects', () => {
      expect(getSubjectColor('science')).toBe('#E5D0FF')
      expect(getSubjectColor('maths')).toBe('#FFDA6E')
      expect(getSubjectColor('language')).toBe('#BDE7FF')
      expect(getSubjectColor('coding')).toBe('#FFC8E4')
      expect(getSubjectColor('history')).toBe('#FFECC8')
      expect(getSubjectColor('economics')).toBe('#C8FFDF')
    })

    it('should return undefined for invalid subjects', () => {
      expect(getSubjectColor('invalid-subject')).toBeUndefined()
      expect(getSubjectColor('')).toBeUndefined()
    })

    it('should be case sensitive', () => {
      expect(getSubjectColor('Science')).toBeUndefined()
      expect(getSubjectColor('MATHS')).toBeUndefined()
    })

    it('should handle all subjects from constants', () => {
      Object.keys(subjectsColors).forEach(subject => {
        const color = getSubjectColor(subject)
        expect(color).toBeDefined()
        expect(typeof color).toBe('string')
        expect(color).toMatch(/^#[0-9A-F]{6}$/i) // Valid hex color
      })
    })
  })

  /**
   * Test configureAssistant function
   * Tests VAPI assistant configuration with different voice and style combinations
   */
  describe('configureAssistant function', () => {
    it('should configure assistant with valid male casual voice', () => {
      const result = configureAssistant('male', 'casual')
      
      expect(result).toHaveProperty('name', 'Companion')
      expect(result).toHaveProperty('firstMessage')
      expect(result.firstMessage).toContain('{{topic}}')
      expect(result.voice?.voiceId).toBe(voices.male.casual)
    })

    it('should configure assistant with valid female formal voice', () => {
      const result = configureAssistant('female', 'formal')
      
      expect(result.voice?.voiceId).toBe(voices.female.formal)
      expect(result.voice?.provider).toBe('11labs')
    })

    it('should fallback to sarah for invalid voice combinations', () => {
      const result = configureAssistant('invalid', 'invalid')
      
      expect(result.voice?.voiceId).toBe('sarah')
    })

    it('should have correct transcriber configuration', () => {
      const result = configureAssistant('male', 'casual')
      
      expect(result.transcriber).toEqual({
        provider: 'deepgram',
        model: 'nova-3',
        language: 'en'
      })
    })

    it('should have correct voice settings', () => {
      const result = configureAssistant('female', 'casual')
      
      expect(result.voice).toEqual({
        provider: '11labs',
        voiceId: voices.female.casual,
        stability: 0.4,
        similarityBoost: 0.8,
        speed: 1,
        style: 0.5,
        useSpeakerBoost: true
      })
    })

    it('should have correct model configuration', () => {
      const result = configureAssistant('male', 'formal')
      
      expect(result.model?.provider).toBe('openai')
      expect(result.model?.model).toBe('gpt-4')
      expect(result.model?.messages).toHaveLength(1)
      expect(result.model?.messages?.[0].role).toBe('system')
      expect(result.model?.messages?.[0].content).toContain('{{ topic }}')
      expect(result.model?.messages?.[0].content).toContain('{{ subject }}')
      expect(result.model?.messages?.[0].content).toContain('{{ style }}')
    })

    it('should initialize empty message arrays', () => {
      const result = configureAssistant('female', 'formal')
      
      expect(result.clientMessages).toEqual([])
      expect(result.serverMessages).toEqual([])
    })

    it('should handle all valid voice and style combinations', () => {
      const voiceTypes = ['male', 'female']
      const styles = ['casual', 'formal']
      
      voiceTypes.forEach(voice => {
        styles.forEach(style => {
          const result = configureAssistant(voice, style)
          const expectedVoiceId = voices[voice as keyof typeof voices][style as keyof typeof voices.male]
          
          expect(result.voice?.voiceId).toBe(expectedVoiceId)
          expect(result.name).toBe('Companion')
        })
      })
    })

    it('should contain required template variables in system message', () => {
      const result = configureAssistant('male', 'casual')
      const systemMessage = result.model?.messages?.[0].content
      
      expect(systemMessage).toContain('{{ topic }}')
      expect(systemMessage).toContain('{{ subject }}')
      expect(systemMessage).toContain('{{ style }}')
    })

    it('should have proper first message template', () => {
      const result = configureAssistant('female', 'casual')
      
      expect(result.firstMessage).toBe(
        "Hello, let's start the session. Today we'll be talking about {{topic}}."
      )
    })
  })

  /**
   * Integration tests for utility functions
   * Tests how functions work together
   */
  describe('Integration tests', () => {
    it('should work with all subjects and voice combinations', () => {
      const subjects = Object.keys(subjectsColors)
      const voiceTypes = ['male', 'female']
      const styles = ['casual', 'formal']
      
      subjects.forEach(subject => {
        const color = getSubjectColor(subject)
        expect(color).toBeDefined()
        
        voiceTypes.forEach(voice => {
          styles.forEach(style => {
            const assistant = configureAssistant(voice, style)
            expect(assistant).toBeDefined()
            expect(assistant.name).toBe('Companion')
          })
        })
      })
    })

    it('should handle edge cases gracefully', () => {
      // Test with empty strings
      expect(getSubjectColor('')).toBeUndefined()
      
      // Test with invalid voice configurations
      const invalidAssistant = configureAssistant('', '')
      expect(invalidAssistant.voice?.voiceId).toBe('sarah')
      
      // Test cn with mixed valid and invalid inputs
      const className = cn('valid-class', null, getSubjectColor('invalid'))
      expect(className).toBe('valid-class')
    })
  })
})