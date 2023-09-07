import { Router, Request, Response } from 'express';
import multer from 'multer';
import * as fs from 'fs';
import { parse } from 'csv-parse';
import { storage } from './services/csv-management.services';
import TypedRequestQuery from "./types/query.types"

const router = Router();

const multerConfig = multer({ storage: storage })

router.post('/api/files', multerConfig.single('file'),
    async (request: Request, response: Response) => {
        const file = request.file
        if (!file) {
            response.status(400).send({ message: 'Please, upload a file' });
            return;
        }

        if (file.originalname.split('.').pop() != 'csv') {
            response.status(400).send({ message: 'Please, upload a csv file' });
            return;
        }

        fs.createReadStream('tmp/csv-example')
            .pipe(parse())
            .on('data', () => {
            })
            .on('end', () => {
                response.status(200).send({ message: 'File is saved' });
                return
            });

    })


router.get('/api/users', (request: TypedRequestQuery<{ q: string }>, response: Response) => {
    const q = request.query.q;
    let result: { Name: string, Country: string, City: string, Favorite_Sport: string }[] = [];

    if (!fs.existsSync('tmp/csv-example')) {
        response.status(402).send({ message: 'File is not found' });
        return
    }

    fs.createReadStream("tmp/csv-example")
        .pipe(parse({ columns: true }))
        .on("data", (data) => {
            for (let item in data) {
                if (data[item].toUpperCase().match(q?.toString().toUpperCase())) {
                    if (!result.includes(data)) {
                        result.push(data)
                    }
                }
            }
        })
        .on("end", () => {
            response.send(result);
        });

});

export { router };