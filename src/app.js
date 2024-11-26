const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const getCityFromCoordinates = require('./utils/axios')

const http = require('http') // You need this to create the server
const socketio = require('socket.io') // Import socket.io
const { error } = require('console')

console.log(__dirname)
console.log(path.join(__dirname, '../public'))

const app = express()
const server = http.createServer(app) // Use the HTTP server to support WebSockets
const io = socketio(server) // Create a new instance of Socket.IO

const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../public/views')
const partialsPath = path.join(__dirname, '../public')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('location', async (latitude, longitude) => {
        const city = await getCityFromCoordinates(latitude, longitude)
        const cityName = city.replace('City of ', '').trim()

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                socket.emit('errorData', error)
            } else {
                socket.emit('data', cityName, forecastData)
            }
        })
    })
})

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Maja'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Maja'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'How can we help you?',
        title: 'Help',
        name: 'Maja'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({
                error
            })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })
            }

            res.send({
                location,
                forecast: forecastData,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term!'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Help article not found.',
        title: '404',
        name: 'Maja'
    })
})

// If an url doesn't match any of the above it will match '*', because every url matches this one
app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'Page not found.',
        title: '404',
        name: 'Maja'
    })
})

server.listen(port, () => {
    console.log('Server is up on port ' + port)
})