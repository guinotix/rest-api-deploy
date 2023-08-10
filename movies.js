const z = require('zod')

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: "Movie must be a string",
        required_error: "Title is required"
    }),
    year: z.number().int().positive().min(1900).max(2030),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10),
    poster: z.string().url(),
    genre: z.array(z.enum(['Action', 'Drama', 'Adventure', 'Comedy', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']))

})

function validateMovie (obj) {
    return movieSchema.safeParse(obj)
}

function validatePartialMovie (obj) {
    return movieSchema.partial().safeParse(obj)
}

module.exports = { validateMovie, validatePartialMovie }