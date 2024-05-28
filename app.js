const express = require('express');

const app = express();
const PORT = 3000;

app.get('/public', (req, res) => {
    res.status(200).send({ 
      'message':  "This is a public enpoint which can be accessed by anonymous users",
    });
})

app.get('/secured', (req, res) => {
    res.status(200).send({ 
      'message':  "This is a secured enpoint which can be accessed by any authenticated user",
    });
})

app.get('/secured-admin', (req, res) => {
    res.status(200).send({ 
      'message':  "This is a secured enpoint which can be accessed only by any authenticated user with role admin",
    });
})

app.listen(PORT, (error) => {
    if (!error) {
        console.log("Server is Successfully Running,  and App is listening on port " + PORT)
    }
    else {
        console.log("Error occurred, server can't start", error);
    }
}
); 