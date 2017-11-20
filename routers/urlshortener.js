require('dotenv').config();
const mongoUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}${process.env.DB_HOST}`;
const router = require('express').Router();
const mongo = require('mongodb');
const { encode, decode } = require('./base58.js');
const regexUrlValidator = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;	// from https://www.regexpal.com/93652

router.get('/', (req, res) => {
	const response = {
		'info': 'URL shortener api',
		'E': 'urlshortener/www.example.com to get shortened URL back',
		'G': 'urlshortener/{shortened URL} to redirect browser to linked address'
	};
	res.type('json');
	res.send(JSON.stringify(response, null, 2));
})

router.get('/:url', (req, res) => {
	const url = req.params.url;
	if (url === 'favicon.ico') {
		res.writeHead(301, { 'Content-Type': 'image/x-icon' });
		res.end();
		return;
	}
	mongo.connect(mongoUrl, (err, db) => {
		if (err) throw err;
		const shortUrls = db.collection('shortUrls');
		res.type('json');
		if (regexUrlValidator.test(url)) {
			shortUrls.findOne({ original_url: url }, (err, doc) => {
				if (err) throw err;
				if (doc != null) {
					const response = {
						'original_url': doc.original_url,
						'short_url': doc.short_url,
						'status': 'Url found in database'
					};
					res.send(JSON.stringify(response, null, 2));
				} else {
					shortUrls.findOneAndUpdate({ _id: 1000 }, { $inc: { "key": 1 } }, (err, counterCode) => {
						if (err) throw err;
						const id = counterCode.value.key;
						const response = {
							'original_url': url,
							'short_url': encode(id),
							'status': `${id - 1000}nth Url added to database`
						};
						res.send(JSON.stringify(response, null, 2));
						delete response.status;
						response._id = id;
						response.date_added = (new Date()).toLocaleString('en-GB', { hour12: false });
						shortUrls.insert(response, (err, doc) => {
							if (err) throw err;
						})
						console.log(`${(new Date()).toLocaleString('en-GB', { hour12: false })} - url-shortener - /${url}`);
					})
				}
			})
		} else {
			shortUrls.findOne({ short_url: url }, (err, doc) => {
				if (doc == null) {
					res.send(JSON.stringify({ '404': 'This short URL not found in database' }, null, 2));
				} else {
					res.redirect('http://' + doc.original_url)
				}
			})
		}
	});
});

module.exports = router;
