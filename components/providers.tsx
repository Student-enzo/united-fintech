'use client'

import { CursorArrowProvider } from '@/components/ui/cursor-arrow'

export function Providers({ children }: { children: React.ReactNode }) {
  return <CursorArrowProvider>{children}</CursorArrowProvider>
}
