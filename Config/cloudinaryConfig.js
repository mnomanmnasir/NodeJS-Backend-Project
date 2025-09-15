const multer = require('multer')
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv')
const fs = require('fs')


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadFileToCloudinary = (file) => {
    const option = {
        resournce_type: file.minetype.startWith('video') ? 'video' : 'image'
    }

    return new Promise((ressolve, reject) => {
        const uploader = file.minetype.startWith('video') ? cloudinary.uploader.upload_large : cloudinary.uploader.upload;
        uploader(file.path, options, (error, result) => {
            fs.unlink(file.path, () => { })
            if (error) {
                return reject(error)
            }
            ressolve(result)
        })

    })
}

const multerMiddleware = multer({dest: 'uploads/'}).single('media');

module.exports = {
    uploadFileToCloudinary,
    multerMiddleware
}