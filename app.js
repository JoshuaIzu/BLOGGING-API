const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sanitize = require('./middlewares/sanitize');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

app.use(helmet({
  contentSecurityPolicy: false, 
  crossOriginEmbedderPolicy: false
}));

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
sanitize(app);

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: err.message });
});

module.exports = app;