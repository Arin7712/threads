import * as z from 'zod';

export const ThreadValidation = z.object({
    thread: z.string().nonempty().min(3, {message: 'Minumum 3 characters'}),
    accountId: z.string(),
    image: z.string().url({message: 'must be a valid URL'}).or(z.literal('')),
})

export const CommentValidation = z.object({
    thread: z.string().nonempty().min(3, {message: 'Minumum 3 characters'}),

})