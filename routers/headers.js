const router = require('express').Router();	

router.get('/', (req, res) => {
	const software = /\([\w\d\s\.\;]+/.exec(req.headers['user-agent'])[0].replace('(', '');
	const response = {
		'ip': req.ip,
		'language': req.acceptsLanguages()[0],
		'software': software,
		'user-agent': req.headers['user-agent']
	};
	res.type('json');
    res.send(JSON.stringify(response, null, 2));
    response.date = (new Date()).toLocaleString('fi-FI', { hour12: false });
    console.log('headers', `${(new Date()).toLocaleString('en-GB', {hour12:false})} - ip/software: ${req.ip} - ${/\([\w\d\s\.\;]+/.exec(req.headers['user-agent'])[0].replace('(', '')}`);
});

module.exports = router;