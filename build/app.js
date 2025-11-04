// dependency imports
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import log from './utils/logger.js';
import { URL } from 'url';
// DB imports
// import connectMongoDb from './db/connect-mongodb.js';
import connectPostgres from './db/connect-postgres.js';
// routes imports
import userRouter from './domains/user/router/user.router.js';
import authRouter from './domains/auth/router/auth.router.js';
import adminRouter from './domains/admin/router/admin.router.js';
import systemRouter from './domains/system/router/system.router.js';
// middleware imports
import { requestDurationLogging } from './middlewares/requestDurationLogging.middleware.js';
// dependency inits
const app = express();
dotenv.config();
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://ruphautomations.zedlabs.xyz']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8081', 'http://10.0.2.2:8081'];
app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'email', 'client']
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// configure .env
if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: '.env.development' });
}
if (process.env.NODE_ENV === 'staging') {
    dotenv.config({ path: '.env.staging' });
}
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
}
// Add request duration logging middleware
app.use(requestDurationLogging);
app.get('/', (_req, res) => {
    res.status(200).send({
        responseMessage: 'Welcome to the Multi DB Node/Express... server',
        response: {
            apiStatus: 'OK - Server is live'
        }
    });
});
// user end-points - all routed
app.use(`/api/v1/user`, userRouter);
app.use(`/api/v1/auth`, authRouter);
app.use(`/api/v1/admin`, adminRouter);
app.use(`/api/v1/system`, systemRouter);
const port = process.env.PORT || 5000;
const start = async () => {
    // const mongoDb_URI = process.env.MONGO_DB_URI;
    try {
        // log.info(`Establishing database connection...`);
        // const mongoDbConnection = await connectMongoDb(mongoDb_URI);
        // if (mongoDbConnection) {
        //   log.info(
        //     `...................................\nConnected to: ${mongoDbConnection?.connection.host}\nEnvironment: ${process.env.DEPLOY_ENV ? process.env.DEPLOY_ENV : 'development'}
        //   \nMongoDB connected successfully \n........................................................`
        //   );
        // }
        await connectPostgres();
        const parsedUrl = new URL(process.env.POSTGRES_DATABASE_URL);
        log.info(`...................................\nConnected to: ${parsedUrl.hostname}\nEnvironment: ${process.env.DEPLOY_ENV ? process.env.DEPLOY_ENV : 'development'}
        \nPostgreSQL connected successfully \n........................................................`);
        // console.log(process.env.JWT_SECRET);
        app.listen(port, () => log.info(`Server is listening on port ${port}...`));
    }
    catch (error) {
        if (error instanceof Error) {
            log.error(error.message);
        }
    }
};
start();
