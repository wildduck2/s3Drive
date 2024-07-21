import { describe, it, expect } from 'vitest'
import { FormatUtils } from '../formatUtils'

// Test data
const testString = 'Hello, World!'
const base64String = 'SGVsbG8sIFdvcmxkIQ=='
const hmacParams = {
  key: 'supersecretkey',
  data: testString,
  encoding: 'hex'
}
const sha256Params = {
  data: testString,
  encoding: 'hex'
}

describe('FormatUtils', () => {
  it('should encode a string to Base64 format', () => {
    const encoded = FormatUtils.encode(testString)
    expect(encoded).toBe(base64String)
  })

  it('should decode a Base64 encoded string to its original format', () => {
    const decoded = FormatUtils.decode(base64String)
    expect(decoded).toBe(testString)
  })

  it('should validate if a string is Base64 encoded', () => {
    const isValid = FormatUtils.isBase64(base64String)
    expect(isValid).toBe(true)
  })

  it('should invalidate if a string is not Base64 encoded', () => {
    const isValid = FormatUtils.isBase64(testString)
    expect(isValid).toBe(false)
  })

  it('should create an HMAC using SHA-256', () => {
    const hmac = FormatUtils.hmac(hmacParams)
    expect(hmac).toBeTypeOf('string')
  })

  it('should create a SHA-256 hash of the given data', () => {
    const hash = FormatUtils.sha256(sha256Params)
    expect(hash).toBeTypeOf('string')
  })
})
