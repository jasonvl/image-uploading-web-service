const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer'); // middleware for handling multipart/form-data, which is primarily used for uploading files
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(bodyParser.urlencoded({ extended: false})); // for POST requests

// to handle request sent by HTML form
app.get('/', function (req, res) {
	// __dirname returns the directory that the currently executing script is in
   res.sendFile( __dirname + "/" + "index.html" );
})

// ----------------------------------------------------------------
// saves file to a folder named 'uploads'
// if no destination is given, the operating system's default directory for temporary files is used
var fileName;
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
      fileName = file;
    	cb(null, 'uploads/')
 	},
 	// names the file based on current date 
  	filename: function (req, file, cb) {
    	cb(null, file.fieldname + '-' + Date.now())
  	}
})

// file uploader
var maxSize = 10 * 1000 * 1000; // 10MBs
app.post('/file_upload', function (req, res) {
	var upload = multer({
    fileFilter: function (req, file, cb) { // filter file by file extension
      if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) { // valid file extensions
        console.log('not OK')
        req.fileValidationError = 'Only .jpg and .png file-types can be accepted';
        return cb(null, false, new Error('Only .jpg and .png file-types can be accepted'));
      } else {
        // To accept the file pass `true`
        console.log('all is good')
        cb(null, true);
      }
    }, 
    storage: storage, 
    limits: {fileSize: maxSize} // file-size limit
  }).single('file');


   	upload(req, res, function (err) {
   		if (req.fileValidationError) {
   			// An error occurred when uploading
        return res.end(req.fileValidationError);
    	} else {
    		// Everything went fine
        var fileSize = fileName.size / 1000000;
    		console.log('File uploaded successfully: ' + fileName.originalname + '(' + fileSize.toString()+ 'MBs)');
        // console.log('File uploaded successfully: ');
        res.sendFile( __dirname + "/" + "goback.html" ); // go back to HOME

    	}
	});
});

// ----------------------------------------------------------------

// send user back the picture that they uploaded 
// NOT WORKING :(
// var storage = multer.memoryStorage()
// var upload = multer({ storage: storage })

// app.post('/gimmeback', upload.single('file'), (req, res) => {
//   res.send(req.file.)
// })

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
