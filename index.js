const app = require('express')();
const home = require('./routers/home.js');
const timestamp = require('./routers/timestamp.js');
const filedata = require('./routers/filedata.js');
const urlshortener = require('./routers/urlshortener.js');
const imagesearch = require('./routers/imagesearch.js');
const headers = require('./routers/headers.js');

app.use('/', home);
app.use('/timestamp', timestamp);
app.use('/filedata', filedata);
app.use('/urlshortener', urlshortener);
app.use('/imagesearch', imagesearch);
app.use('/headers', headers);
app.use( (req, res, next) => res.status(404).send("404 - no content here, go to / to see all the endpoints") )

const port = process.env.PORT || 3000;
app.listen(port);