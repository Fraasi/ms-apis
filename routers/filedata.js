const router = require('express').Router();
const multer = require('multer');
const upload = multer();

const form = '<p>Submit a file to view its filesize and mimetype.</p> <form action="/filedata/result" enctype="multipart/form-data" method="post"> <input type="file" name="file"> </br></br> <input type="submit"> </form>';

router.get('/', (req, res) => {
    res.send(form);
})

router.post('/result', upload.single('file'), function (req, res) {
    res.type('json');
    if (req.file == undefined) {
        res.send(JSON.stringify({
            'error': 'go back and choose a file before you submit'
        }, null, 2));
    } else {
        const response = {
            'name': req.file.originalname,
            'mimetype': req.file.mimetype,
            'size': returnFileSize(req.file.size)
        };
        res.send(JSON.stringify(response, null, 2));
    }
});

function returnFileSize(number) {
    // from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
    if (number < 1024) {
        return number + ' bytes';
    } else if (number > 1024 && number < 1048576) {
        return (number / 1024).toFixed(1) + ' KB';
    } else if (number > 1048576) {
        return (number / 1048576).toFixed(1) + ' MB';
    }
}

module.exports = router;
