import { z } from 'zod'
export const adminSchema = z
  .object({
    id: z.string({ required_error: 'enter valid id' }),
    username: z.string({ required_error: 'email is required' }).trim().nonempty(),
    password: z.string({ required_error: 'password is required' }).refine((password) => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      return passwordRegex.test(password)
    }, 'Password must contain at least one uppercase letter, one lowercase letter, one special character, and be a minimum of 8 characters long'),
    rePassword: z.string({ required_error: 'password is required' }),
  })
  .strict()
export const AdminDtoSchema = adminSchema
  .omit({
    id: true,
  })
  .refine((check) => check.rePassword === check.password, {
    message: 'password does not match',
    path: ['rePassword'],
  })
export const AdminLoginDtoSchema = z.object({
  username: z.string({ required_error: 'username required' }),
  password: z.string({ required_error: 'username required' }),
})
export type Admin = z.infer<typeof adminSchema>
export type AdminDto = z.infer<typeof AdminDtoSchema>
