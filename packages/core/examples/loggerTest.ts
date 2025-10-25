// import { createLogger } from '../src/loggers/createLogger';
// import express from 'express';
// import fs from 'fs';


// // Create a logger instance with custom configuration
// // This logger will log messages to the console and can be extended to log to files or other
// // const writeMsg = fs.writeFileSync('logs/abimongo.log', '', { flag: 'a' });

// export const logger = createLogger({
// 	level: 'debug',
// 	colorize: true,
// 	transport: {
// 		write: async (message: string) => {
// 			console.log(message); // Log to console
// 			return true;
// 		},
// 	},
// 	format: (message: string, ...meta: any[]) => {
// 		return `[${new Date().toISOString()}] ${message} ${meta.length ? JSON.stringify(meta) : ''}`;
// 	}
// });

// const app = express();
// const PORT = 3000;
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
// 	logger.info('Received a request on root endpoint');
// 	res.send('Hello, World!');
// });
// app.listen(PORT, () => {
// 	logger.info(`Server is running on http://localhost:${PORT}`);
// });