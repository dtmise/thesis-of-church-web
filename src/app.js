import express       from 'express';
import logMiddleware from './middleware/log.js';
import { authGuard} from './middleware/authGuard.js'
import authRoutes    from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import teamsRoutes   from './routes/teams.js';
import newsRoutes    from './routes/news.js';
import errorSupresser from './middleware/errorSupresser.js';

let errorPasser;
if (process.env.NODE_ENV !== 'development') {
    errorPasser = fn => (req, res, next) =>
        Promise().resolve(fn(req, res, next)).catch(next);
} else {
    errorPasser = fn => fn;
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logMiddleware);
app.use('/api/auth', errorPasser(authRoutes));
app.use(errorPasser(authGuard));

app.use('/api/profile', errorPasser(profileRoutes));
app.use('/api/teams', errorPasser(teamsRoutes));
app.use('/api/news', errorPasser(newsRoutes));

if (process.env.NODE_ENV !== 'development') {
    app.use(errorSupresser);
}

export default app;
