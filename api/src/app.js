import express       from 'express';
import cors          from 'cors';
import cookieParser  from 'cookie-parser';
import inputLogMiddleware from './middleware/inputLog.js';
import outputLogMiddleware from './middleware/outputLog.js';
import { authGuard} from './middleware/authGuard.js'
import authRoutes    from './routes/auth.js';
import contactsRoutes from './routes/contacts.js';
import profileRoutes from './routes/profile.js';
import teamsRoutes   from './routes/teams.js';
import newsRoutes    from './routes/news.js';
import adminRoutes   from './routes/admin.js';
import errorSupresser from './middleware/errorSupresser.js';

let errorPasser;
const corsOrigin = process.env.CORS_ORIGIN ?? 'https://computable.tech';

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
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(inputLogMiddleware);
app.use('/api/auth', errorPasser(authRoutes));
app.use('/api/contacts', errorPasser(contactsRoutes));
app.use(errorPasser(authGuard));

app.use('/api/profile', errorPasser(profileRoutes));
app.use('/api/teams', errorPasser(teamsRoutes));
app.use('/api/news', errorPasser(newsRoutes));
app.use('/api/admin', errorPasser(adminRoutes));

if (process.env.NODE_ENV !== 'test') {
    app.use(errorSupresser);
}

export default app;
