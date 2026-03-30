const outputLogMiddleware = (req, res, next) => {
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
        'OUTPUT: ',
        timestamp, '::', 
        res.status, 
        'body = ', res.body()
    );
    next();
}

export default outputLogMiddleware;