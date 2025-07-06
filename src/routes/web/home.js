import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    const nodeVersion = process.version;
    const environment = process.env.NODE_ENV || 'development';
    const currentYear = new Date().getFullYear();

    res.render('pages/home', {
        title: 'NodeExpress',
        tagline: 'Node + Express Server',
        description: 'Backend server powered by Node.js and Express.js',
        nodeVersion,
        environment,
        currentYear
    });
});

export default router;
