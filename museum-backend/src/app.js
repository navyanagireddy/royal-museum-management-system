const express = require('express');
const bodyParser = require('body-parser');
const museumRoutes = require('./routes/museumRoutes');
const app = express();

app.use(bodyParser.json());
app.use('/api/museums', museumRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});