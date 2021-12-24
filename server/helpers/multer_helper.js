const config = require('../environments/index');
const multer = require('multer');
const helpers = require('../helpers/validations');

// const fs = require('fs');
let fse = require('fs-extra');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let Id = req.body.id;
        let path = `tmp/daily_gasoline_report/${Id}`;
        fse.mkdirsSync(path);
        cb(null, path);
    },
    filename: function (req, file, cb) {
        // console.log(file);

        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, file.fieldname + '-' + Date.now() + "." + extension);
    }
})

var upload = multer({ storage: storage });

let createUserImage = upload.array('images', 100);

// to delete file
// const deleteSingleExistingImage = (source) => {
//     if (source && source.filename) {
//         fs.unlink(source.destination + '/' + source.filename, (err) => {
//             if (err) {
//                 console.log(err)
//             }
//         })
//     }
//     return true;
// };

let multerHelper = {
    createUserImage,
    // deleteSingleExistingImage
}

module.exports = multerHelper;
