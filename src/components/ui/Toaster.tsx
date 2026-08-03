import { Toaster as SonnerToaster } from 'sonner'
import { useThemeStore } from '../../store/themeStore'

export function Toaster() {
  const theme = useThemeStore((state) => state.theme)
  return <SonnerToaster position="top-right" richColors closeButton theme={theme} />
}
