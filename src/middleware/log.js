const logMiddleware = (req, res, next) => {
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    console.log(
        timestamp, '::', 
        req.method, 
        req.path, '::',
        'urlencoded and body arguments = ', req.body
    );
    next();
}

export default logMiddleware;