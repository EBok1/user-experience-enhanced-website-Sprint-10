// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates innpm 
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({ extended: true }))


// TODO: routes voor deze hallen applicatie..
const apiUrl = 'https://fdnd-agency.directus.app/items/dh_services'

const projecten = []

app.get('/', function (request, response) {
    fetchJson(apiUrl).then((servicesDataUitDeAPI) => {
        response.render('home', { services: servicesDataUitDeAPI.data })
    });
})

app.get('/vraag-aanbod', function (request, response) {
    fetchJson(apiUrl).then((servicesDataUitDeAPI) => {
        response.render('vraag-aanbod', { services: servicesDataUitDeAPI.data, projecten: projecten })
    });
})

app.get('/vraag-aanbod/:projectId', function (request, response) {
    fetchJson(apiUrl + '?filter={"id":' + request.params.projectId + '}').then((serviceDetail) => {
        response.render('detail', { service: serviceDetail.data[0] })
    })
})

app.get('/contact', function (request, response) {
    fetchJson(apiUrl).then((servicesDataUitDeAPI) => {
        response.render('contact', { services: servicesDataUitDeAPI.data })
    });
})

app.get('/about', function (request, response) {
    fetchJson(apiUrl).then((servicesDataUitDeAPI) => {
        response.render('about', { services: servicesDataUitDeAPI.data })
    });
})

app.get('/faq', function (request, response) {
    fetchJson(apiUrl).then((servicesDataUitDeAPI) => {
        response.render('faq', { services: servicesDataUitDeAPI.data })
    });
})



app.get('/project-insturen', function (request, response) {
    fetchJson(apiUrl).then((servicesDataUitDeAPI) => {
        response.render('project-insturen', { services: servicesDataUitDeAPI.data })
    });
})

app.get('/vraag', function (request, response) {
    fetchJson(apiUrl).then((servicesDataUitDeAPI) => {
        response.render('vraag', { services: servicesDataUitDeAPI.data })
    });
})

app.get('/aanbod', function (request, response) {
    fetchJson(apiUrl).then((servicesDataUitDeAPI) => {
        response.render('aanbod', { services: servicesDataUitDeAPI.data })
    });
})

// Add this new route to handle the form POST request
app.post('/submit-form-vraag', (request, response) => {
    // projecten.push(request.body.titel)
    projecten.push({
        long_description: request.body.beschrijving,
        title: request.body.titel,
        type: 'vraag',
        image: request.body.document,
        categories: request.body.catagorie,
        neighbourhood: request.body.buurt,
        start_date: request.body.datum,
        time: request.body.tijd,
        location: request.body.locatie,
        name: request.body.naam,
        email: request.body.email,
        nummer: request.body.nummer,
    })

    response.redirect(303, '/vraag-aanbod')
    console.log(projecten);
})


// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
    // Toon een bericht in de console en geef het poortnummer door
    console.log(`Application started on http://localhost:${app.get('port')}`)
})