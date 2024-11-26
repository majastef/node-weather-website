const socket = io()

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const msg1Text = document.getElementById('msg1')
const cityText = document.getElementById('city')
const getLocationButton = document.querySelector('#get-location')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const location = search.value

    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''    

    fetch('/weather?address=' + location).then((response) => {
        response.json().then((data) => {
            if(data.error) {
                messageOne.textContent = data.error
            } else {
                messageOne.textContent = data.location
                messageTwo.textContent = data.forecast
            }
        })
    })
})

getLocationButton.addEventListener('click', () => {
    cityText.textContent = 'Loading...'
    msg1Text.textContent = ''
    
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('location', position.coords.latitude, position.coords.longitude)
    }) 
})

socket.on('data', (city, data) => {
    city.textContent = city
    msg1.textContent = data
})

socket.on('errorData', (error) => {
    city.textContent = error
})