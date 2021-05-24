const express = require('express');
const app = express();

app.use(express.json({extended:false}));
const PORT = process.env.PORT || 5000;


app.use('/user',require('./router/user'));




app.use('',(req, res) => res.send('Ooops 404'));

app.listen(PORT, (err) => {
    console.log(`Server is listining on port ${PORT}..`);
});