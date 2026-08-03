import { z } from 'zod'

export const profileFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  avatar: z.union([z.literal(''), z.string().url('Enter a valid URL')]),
  title: z.string().trim().max(100),
  phone: z.string().trim().max(30),
  location: z.string().trim().max(100),
  bio: z.string().trim().max(1000),
})
export type ProfileFormValues = z.infer<typeof profileFormSchema>

export const PROFILE_FORM_DEFAULTS: ProfileFormValues = {
  name: '',
  avatar: '',
  title: '',
  phone: '',
  location: '',
  bio: '',
}
