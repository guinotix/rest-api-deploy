const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./movies')


const app = express()

app.disable('x-powered-by')
app.use(express.json())

// API Peliculas
app.get('/movies', (req, res) => {
    // Todos los origenes que no seamos nosotros, están permitidos
    res.header('Access-Control-Allow-Origin', '*')

    const { genre } = req.query
    if (genre) {
        const filtered = movies.filter(
            movie => movie.genre.some(
                g => g.toLowerCase() === genre.toLowerCase()
            )
        )
        return res.json(filtered)
    }
    res.json(movies)
})

app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)
    res.status(404).json({ message: "Movie not found" })
})

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body)

    if (!result.success) {
        return res.status(400).json({
            message: ""
        })
    }

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }

    movies.push(newMovie)

    res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovie(req.body)
    if (!result.success) {
        return res.status(400).json({
            error: JSON.parse(result.error.message)
        })
    }

    const { id } = req.params
    
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex < 0) res.status(404).json({ message: "Movie not found" })
    
    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }
    movies[movieIndex] = updateMovie
    return res.json(updateMovie)
    
})

app.delete('/movies/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex < 0) res.status(404).json({ message: "Movie not found" })
    movies.splice(movieIndex, 1)
    return res.json({ message: "Movie deleted" })

})

app.options('/movies', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Mothods', 'GET, POST, PATCH, DELETE')
    return res.send(200)

})


const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})