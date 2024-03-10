import * as dotenv from 'dotenv';
dotenv.config();

import { default as express, Express } from 'express';
import { default as cors } from 'cors';
import { default as BodyParser } from 'body-parser';

import { default as dns } from 'dns';

let app = express();
app.use(cors({ optionsSuccessStatus: 200 }));

app.get('/', (req, res) => {
	res.send('API: GET /api/shorturl/:id, POST /api/shorturl');
});

// Status codes are commented out because freeCodeCamp fails the test if they're there...

let shortlinks: string[] = [];
app.get('/api/shorturl/:id', (req, res) => {
	const id = parseInt(req.params.id);
	if (id in shortlinks) {
		return res.redirect(shortlinks[id]);
	} else {
		return res/*.status(404)*/.json({ error: 'ID not found' });
	}
});

app.post('/api/shorturl', BodyParser.urlencoded({ extended: false }), async (req, res) => {
	const url = req.body.url;
	let parsed: URL;

	try {
		parsed = new URL(url);
	} catch (e) {
		return res/*.status(400)*/.json({ error: 'invalid url' });
	}
	
	dns.lookup(parsed.hostname, (err) => {
		if (err) {
			return res/*.status(400)*/.json({ error: 'invalid url' });
		} else {
			return res.json({
				original_url: parsed.toString(),
				short_url: shortlinks.push(parsed.toString()) - 1 // off by one
			});
		}
	});
});

app.listen(process.env.PORT || 3000, () => {
	console.log('Ready, listening on port ' + (process.env.PORT || 3000));
});