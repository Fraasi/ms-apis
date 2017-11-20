const router = require('express').Router();

router.get('/', (req, res) => {
  const response = {
    'info': 'goto any of the urls below to find an api',
    'home': '/',
    'image_search': '/imagesearch',
    'time_stamp': '/timestamp',
    'url_shortener': '/urlshortener',
    'file_metadata': '/filedata',
    'headers': '/headers'
    };
  res.end(JSON.stringify(response, null, 2));
  console.log(req.ip, ' hit home at ' , (new Date()).toLocaleString('fi-FI', { hour12: false }));
  
});

module.exports = router;