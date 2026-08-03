import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '../../../components/ui'
import type { InputProps } from '../../../components/ui'

export type PasswordInputProps = Omit<InputProps, 'type'>

export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  return (
    <Input
      type={visible ? 'text' : 'password'}
      autoComplete="current-password"
      rightIcon={
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          tabIndex={-1}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      }
      {...props}
    />
  )
}
