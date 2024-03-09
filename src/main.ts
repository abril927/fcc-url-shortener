import * as dotenv from 'dotenv';
dotenv.config();

import { default as express, Express } from 'express';
import { default as cors } from 'cors';

let app = express();
app.use(cors({ optionsSuccessStatus: 200 }));

app.get('/', (req, res) => {
	res.send('API: /api/:date');
});

app.get('/api/:date?', (req, res) => {
	const date = req.params.date;
	let parsed: Date;
	if (date != null) {
		parsed = new Date(date);
		if (isNaN(parsed.getTime())) {
			parsed = new Date(parseInt(date));
			if (isNaN(parsed.getTime())) {
				return res.json({ error: 'Invalid Date' });
			}
		}
	} else {
		parsed = new Date();
	}
	
	return res.json({ unix: parsed.getTime(), utc: parsed.toUTCString() });
});

app.listen(process.env.PORT || 3000, () => {
	console.log('Ready, listening on port ' + (process.env.PORT || 3000));
});