const express = require('express');
const path = require('path');
const { checkConnection } = require('./config/db'); 
const { createUsersTable,createStoresTable,createRatingsTable } = require('./utils/dbUtils');
const app = express();
const PORT = process.env.PORT || 5000;
const Routes = require("./routes/Routes");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use('/api/auth', Routes);

    

    app.listen(PORT, async () => {
        console.log('Server listening on port ${PORT}');
        try {
            await checkConnection(); 
            await createUsersTable();
            await createStoresTable();
            await createRatingsTable();
        }
        catch (error) {
            console.log("not connected",error);
        }
    });