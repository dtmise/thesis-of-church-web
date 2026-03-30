import express       from 'express';
import logMiddleware from './middleware/log.js';
import { authMiddleware} from './middleware/auth.js'
import authRoutes    from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import teamsRoutes   from './routes/teams.js';
import newsRoutes    from './routes/news.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logMiddleware);
app.use('/api/auth', authRoutes);
app.use(authMiddleware);

app.use('/api/profile', profileRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/news', newsRoutes);

export default app;
