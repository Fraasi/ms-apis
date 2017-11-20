const router = require('express').Router();
const url = require('url');

router.get('*', (req, res) => {
	const addr = url.parse(req.url, true);
	addr.input = (addr.path.charAt(1).toUpperCase() + addr.path.slice(2)).replace(/%20/g, ' ');
	res.set('Content-Type', 'application/json');
	if (addr.input === '') {
		const response = {
			'info': "No input. Write unix or natural time in the address bar. For example timestamp/2188609200000 or timestamp/August 25, 1900"
		};
		res.send(JSON.stringify(response, null, 2));
	} else if (!isNaN(addr.input)) {
		const date = new Date(parseInt(addr.input));
		const response = {
			'true': 'Valid unix',
			'Unix': date.getTime(),
			'Natural': `${months[date.getMonth()]}-${date.getDate()}-${date.getFullYear()}`
		};
		res.send(JSON.stringify(response, null, 2));
	} else if (isNaN(addr.input) && /^[a-z]+/i.exec(addr.input) !== null && months.includes(/^[a-z]+/i.exec(addr.input)[0]) && !isNaN(addr.input.slice(-1)) && Boolean(Number(/[\d\w]+$/i.exec(addr.input)))) {
		const day = Math.abs(/[-\s]\d+/.exec(addr.input)[0]);
		const month = months.indexOf(/^[a-z]+/i.exec(addr.input)[0]);
		const year = /\d+$/.exec(addr.input)[0];
		const date = new Date(year, month, day);
		const response = {
			'true': 'Valid date',
			'Unix': date.getTime(),
			'Natural': `${months[date.getMonth()]}-${date.getDate()}-${date.getFullYear()}`,
			'parsed input': { day: +day, 'month': month + 1, year: +year }
		};
		res.send(JSON.stringify(response, null, 2));
	} else {
		const response = {
			'Error': 'Not a valid date. Use format like August 25, 1900 or 2188609200000',
			'Unix': null,
			'Natural': null,
			'your epic fail': addr.input
		};
		res.send(JSON.stringify(response, null, 2));
	}
	res.end();
});

const months = ["January", "February", "March", "April", "May", "June",	"July", "August", "September", "October", "November", "December"];

module.exports = router;