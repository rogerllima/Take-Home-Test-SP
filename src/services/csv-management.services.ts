import multer from 'multer';

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './tmp/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = 'csv-example'
        cb(null, uniqueSuffix)
    }
})