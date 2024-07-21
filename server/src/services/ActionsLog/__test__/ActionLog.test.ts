import { describe, it, expect, vi, Mock } from 'vitest'
import { ActionLog } from '../ActionLog' // Adjust the import path
import { DriverLog } from '@prisma/client'
import { prisma } from '../../..'

// Mock the Prisma client
vi.mock('../../..', () => ({
  prisma: {
    driverLog: {
      create: vi.fn()
    }
  }
}))

describe('ActionLog', () => {
  it('should store an action log and return the created record', async () => {
    const mockLog: DriverLog = {
      id: '1',
      user_id: 'user1',
      blobs_id: 'blob1',
      action: 'ACTION_CREATED',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Mock the Prisma create method to return the mock log
    ;(prisma.driverLog.create as Mock).mockResolvedValue(mockLog)

    const result = await ActionLog.storeAction({
      user_id: 'user1',
      blobs_id: 'blob1',
      action: 'ACTION_CREATED'
    })

    expect(result).toEqual(mockLog)
  })

  it('should return null if the Prisma create method fails', async () => {
    // Mock the Prisma create method to throw an error
    ;(prisma.driverLog.create as Mock).mockRejectedValue(
      new Error('Database error')
    )

    const result = await ActionLog.storeAction({
      user_id: 'user1',
      blobs_id: 'blob1',
      action: 'ACTION_CREATED'
    })

    expect(result).toBeNull()
  })
})
