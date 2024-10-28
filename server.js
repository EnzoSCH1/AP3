const mariadb = require('mariadb');
const express = require('express');
let ligueRoute = require("./routes/ligueRoute")

const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());



app.use('/api/ligue', ligueRoute);
//app.use('/api/user', userRoute);

app.listen(3000, () => {
                console.log("Server à l'écoute sur le port 3000");
});
