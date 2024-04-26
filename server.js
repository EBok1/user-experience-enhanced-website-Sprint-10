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
const baseUrl = 'https://fdnd-agency.directus.app/'
const likes = []
const projecten = []

app.get('/', function (request, response) {
    fetchJson(apiUrl).then((servicesDataUitDeAPI) => {
        response.render('home', {
            services: servicesDataUitDeAPI.data,
            likes: likes
        })
    });
})
app.post('/', function (request, response) {
    likes.push(request.body.like)
    response.redirect(303, '/')
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

// Dit definieert een POST-verzoekshandler voor de route '/vraag-aanbod/:projectId'. 
// Dit betekent dat deze handler wordt geactiveerd wanneer er een POST-verzoek naar deze specifieke route wordt gestuurd.
app.post('/vraag-aanbod/:projectId', function (request, response) {
    console.log('POST met projectId: ' + request.params.projectId);

    // fetch verzoek naar een externe API, om gegevens op te halen uit een bepaalde url 
    // projectID wordt gebruikt in de URL. Zodra de gegevens zijn opgehaald, wordt een functie uitgevoerd om de gegevens te werken.
    fetchJson(`${baseUrl}items/dh_services/${request.params.projectId}`).then(({ data }) => {

        // patch verzoek, gegevens wordenbijgewerkt op basis van het ontvangen projectid
        // het verzoek bevat JSON-gegevens met de bij te werken informatie, in dit geval wordt het aantal likes met één verhoogd.
        fetch(`${baseUrl}items/dh_services/${request.params.projectId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                likes: data.likes + 1,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then((patchResponse) => {
            // Redirect naar de persoon pagina
            response.redirect(303, '/vraag-aanbod/' + request.params.projectId)
        })
    })
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

app.get('/aanbod', function (request, response) {
    fetchJson(apiUrl).then((servicesDataUitDeAPI) => {
        response.render('aanbod', { services: servicesDataUitDeAPI.data })
    });
})



app.get('/about', function (request, response) {
    fetchJson(apiUrl).then((servicesDataUitDeAPI) => {
        response.render('about', { services: servicesDataUitDeAPI.data })
    });
})

app.get('/contact', function (request, response) {
    fetchJson(apiUrl).then((servicesDataUitDeAPI) => {
        response.render('contact', { services: servicesDataUitDeAPI.data })
    });
})

app.get('/faq', function (request, response) {
    fetchJson(apiUrl).then((servicesDataUitDeAPI) => {
        response.render('faq', { services: servicesDataUitDeAPI.data })
    });
})





// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
    // Toon een bericht in de console en geef het poortnummer door
    console.log(`Application started on http://localhost:${app.get('port')}`)
})