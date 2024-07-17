import { render, screen } from '@testing-library/react'
import { Index } from '../index' // Adjust the import path as per your project structure

test('renders welcome message', async () => {
  render(<Index />)

  const welcomeElement = screen.getByText(/welcome home/i)

  expect(welcomeElement).toBeInTheDocument()
})
