import { z } from 'zod'

export const userSchema = z
  .object({
    id: z.string({ required_error: 'enter valid id' }),
    name: z.string({ required_error: 'name is required' }).trim().nonempty('name is required'),
    email: z.string({ required_error: 'email is required' }).trim().nonempty().email('enter a valid email'),
    address: z.string({ required_error: 'password is required' }),
    telephone: z.string({ required_error: 'password is required' }),
  })
  .strict()
export const UserDtoSchema = userSchema.omit({
  id: true,
})
export type User = z.infer<typeof userSchema>
export type UserDto = z.infer<typeof UserDtoSchema>
