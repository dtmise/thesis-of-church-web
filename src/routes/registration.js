const registration = Router();

registration.use(() => {
    if (req.session.user.role !== 'admin') {
        res.status(401).json({ message: 'Must be admin'});
    }
});

export default registration;