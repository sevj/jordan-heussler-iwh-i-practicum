const express = require('express');
const axios = require('axios');
const app = express();
const pug = require('pug');
const dotenv = require('dotenv');



dotenv.config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.API_KEY;

const customObjectId = process.env.CUSTOM_OBJECT_ID;

const customObjectGetUrl = 'https://api.hubspot.com/crm/v3/objects/' + customObjectId;
const customObjectPostUrl = 'https://api.hubspot.com/crm/v3/objects/' + customObjectId;

const formView = pug.compileFile('views/updates.pug');
const homepageView = pug.compileFile('views/homepage.pug');


app.get('/', async (req, res) => {
    const properties = [
        'breed',
        'weight',
        'name'
    ];
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    const params = 'properties=' + properties.join('&properties=') + '&limit=100';
    const url = customObjectGetUrl + '?' + params;

    try {
        const resp = await axios.get(url, { headers });
        const response = resp.data.results;

        res.send(homepageView({
            response: response
        }))

    } catch (error) {
        console.error(error);
    }
})

app.get('/update-cobj', (req, res) => {
    res.send(formView({
        'title': 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    }))
})

app.post('/update-cobj', async (req, res) => {
    const body = req.body;

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    const data = {
        properties: {
            'name': body.name,
            'weight': body.weight,
            'breed': body.breed
        }
    }

    try {
        const resp = await axios.post(customObjectPostUrl, data, { headers });

        res.redirect('/')
    } catch (error) {
        console.error(error);
    }
})

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));