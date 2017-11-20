require('dotenv').config();
require('isomorphic-fetch');
const router = require('express').Router();
const mongo = require('mongodb');
const mongoUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}${process.env.DB_HOST}`;

router.get('/', (req, res) => {
    const response = {
        'info': 'Unsplash.com image search',
        'how_to': 'imagesearch/{query}[?page=1&per_page=10]',
        'eg': 'imagesearch/cats?page=4&per_page=15 or just imagesearch/cats',
        'extra': 'goto imagesearch/latest to see 25 latest search terms'
    }
    res.type('json');
    res.send(JSON.stringify(response, null, 2));
})

router.get('/:query', function (req, res) {
    const per_page = +req.query.per_page || 10;
    const page = +req.query.page || 1;
    const query = req.params.query;

    if (query == 'latest' && req.query.page == undefined && req.query.per_page == undefined) {
        mongo.connect(mongoUrl, (err, db) => {
            if (err) throw err;
            const unsplashSearches = db.collection('unsplashSearches');
            unsplashSearches.find({}, { _id: false })
                .sort({ $natural: -1 })
                .limit(25)
                .toArray((err, docs) => {
                    if (err) throw err;
                    res.type('json');
                    res.send(JSON.stringify(docs, null, 2));
                })
        })
        return;
    }

    fetch(`https://api.unsplash.com/search/photos/?client_id=${process.env.APP_ID}&per_page=${per_page}&page=${page}&query=${query}`)
        .then(data => data.json())
        .then(json => {

            const response = {
                'info': 'Unsplash.com image search',
                'howto': 'imagesearch/{query}[?page=1&per_page=10]',
                'eg': 'imagesearch/cats?page=4&per_page=15 or just imagesearch/cats',
                'extra': 'goto imagesearch/latest to see 25 latest search terms',
                'query': req.params.query,
                'page': page,
                'results_per_page': per_page,
                'total_hits': json.total,
                'total_pages': json.total_pages,
                'results': {}
            }

            json.results.forEach((el, i) => {
                response.results[i + 1] = {
                    'photographer': el.user.name,
                    'bio': el.user.bio,
                    'profile_page': el.user.links.html,
                    'image_url': el.urls.regular
                }
            });

            res.type('json');
            res.send(JSON.stringify(response, null, 2));

            mongo.connect(mongoUrl, (err, db) => {
                if (err) throw err;
                const doc = {
                    'query': query,
                    'date': (new Date()).toLocaleString('fi-FI', { hour12: false })
                }
                db.collection('unsplashSearches').insertOne(doc, (err, d) => {
                    if (err) throw err;
                })
            })

        })

})

module.exports = router; 