import request from 'supertest';
import express from 'express';
import { router } from './routes';
import * as fs from 'fs';


const app = express();

app.use(router);

beforeEach(() => {
    const filePath = 'tmp/csv-example';

    fs.unlink(filePath, (err) => {
    });
});
describe('routes.ts', () => {
    it('Should return error 400 when a file is not found', async () => {
        const response = await request(app)
            .get('/api/users')

        expect(response.status).toBe(402);

        expect(response.body).toEqual({ message: 'File is not found' });
    });

    it('Should upload a CSV file', async () => {
        const response = await request(app)
            .post('/api/files')
            .attach('file', 'src/assets/test-csv.csv');

        expect(response.status).toBe(200);

        expect(response.body).toEqual({ message: 'File is saved' });
    });

    it('Should return error 400 when the user do not send a file', async () => {
        const response = await request(app)
            .post('/api/files')
            .attach('file', '');

        expect(response.status).toBe(400);

        expect(response.body).toEqual({ message: 'Please, upload a file' });
    });

    it('Should return error 400 when the user do not send a csv file', async () => {
        const response = await request(app)
            .post('/api/files')
            .attach('file', 'src/assets/pdf-test.pdf');

        expect(response.status).toBe(400);

        expect(response.body).toEqual({ message: 'Please, upload a csv file' });
    });

    it('Should return success when the query filter is empty', async () => {
        const result: { Name: string, Country: string, City: string, Favorite_Sport: string }[] = [
            {
                "Name": "John",
                "City": "New York",
                "Country": "USA",
                "Favorite_Sport": "Basketball"
            },
            {
                "Name": "Jane Smith",
                "City": "London",
                "Country": "UK",
                "Favorite_Sport": "Football"
            },
            {
                "Name": "Mike Johnson",
                "City": "Paris",
                "Country": "France",
                "Favorite_Sport": "Tennis"
            },
            {
                "Name": "Karen Lee",
                "City": "Tokyo",
                "Country": "Japan",
                "Favorite_Sport": "Swimming"
            },
            {
                "Name": "Tom Brown",
                "City": "Sydney",
                "Country": "Australia",
                "Favorite_Sport": "Running"
            },
            {
                "Name": "Emma Wilson",
                "City": "Berlin",
                "Country": "Germany",
                "Favorite_Sport": "Basketball"
            }
        ];
        const requestResponse = await request(app)
            .post('/api/files')
            .attach('file', 'src/assets/test-csv.csv');
        const response = await request(app)
            .get('/api/users')
            .query({ q: '' })

        expect(response.status).toBe(200);

        expect(response.body).toEqual(result);
    });

    it('Should return success when the query filter is set', async () => {
        const result: { Name: string, Country: string, City: string, Favorite_Sport: string }[] = [
            {
                "Name": "John",
                "City": "New York",
                "Country": "USA",
                "Favorite_Sport": "Basketball"
            },
            {
                "Name": "Mike Johnson",
                "City": "Paris",
                "Country": "France",
                "Favorite_Sport": "Tennis"
            }
        ];
        const requestResponse = await request(app)
            .post('/api/files')
            .attach('file', 'src/assets/test-csv.csv');
        const response = await request(app)
            .get('/api/users')
            .query({ q: 'john' })

        expect(response.status).toBe(200);

        expect(response.body).toEqual(result);
    });


});
