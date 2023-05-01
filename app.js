const express = require('express');
const notFound = require('./middlewares/not_found');
const routes = require('./routers/routes');
const app = express();

app.use(express.json());
app.use("/api/v1",routes);
app.use(notFound);


app.listen(5000,()=>{
    console.log("Listening");
})