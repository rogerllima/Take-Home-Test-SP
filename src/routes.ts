import { Router, Request, Response } from 'express';
import multer from 'multer';
import * as fs from 'fs';
import { parse } from 'csv-parse';

const router = Router();

let results: any[] = [];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './tmp/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = 'csv-example'
        cb(null, uniqueSuffix)
    }
})

const multerConfig = multer({ storage: storage })


router.post(
    '/api/files',
    multerConfig.single('file'),
    async (request: Request, response: Response) => {
        fs.createReadStream('tmp/csv-example')
            .pipe(parse())
            .on('data', (line) => {
                results.push(line);
            }).on('end', () => {
                response.json({ message: 'File is saved' });
            });

    })

router.get('/api/users', (request: Request, response: Response) => {
    let filter = request.query.filter;    
    for (let items of results) {
        for (let item of items) {
            if (item.toUpperCase().match(filter?.toString().toUpperCase())) {
                return response.json({
                    Name: items[0],
                    City: items[1],
                    Country: items[2],
                    Favorite_Sport: items[3]
                })
            }
        }
    }


});

export { router };