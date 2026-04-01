import express       from 'express';
import cors          from 'cors';
import inputLogMiddleware from './middleware/inputLog.js';
import outputLogMiddleware from './middleware/outputLog.js';
import { authGuard} from './middleware/authGuard.js'
import authRoutes    from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import teamsRoutes   from './routes/teams.js';
import newsRoutes    from './routes/news.js';
import errorSupresser from './middleware/errorSupresser.js';

let errorPasser;

if (process.env.NODE_ENV !== 'test') {
    errorPasser = fn => {
        return async (req, res, next) => {
            try {
                await fn(req, res, next);
            } catch(err) {
                next(err);
            }
        }
    }
} else {
    errorPasser = fn => { return fn };
}
const app = express();

app.use(cors({
    origin: 'https://computable.tech', // your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(inputLogMiddleware);
app.use('/api/auth', errorPasser(authRoutes));
app.use(errorPasser(authGuard));

app.use('/api/profile', errorPasser(profileRoutes));
app.use('/api/teams', errorPasser(teamsRoutes));
app.use('/api/news', errorPasser(newsRoutes));

if (process.env.NODE_ENV !== 'test') {
    app.use(errorSupresser);
}

export default app;
