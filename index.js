// Import dependencies
const fs = require("fs");
const { google } = require("googleapis");
require('dotenv').config();

const service = google.sheets("v4");

// Configure auth client
const authClient = new google.auth.JWT(
    process.env.client_email,
    null,
    process.env.private_key.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
);

const express = require('express')
const app = express()
const port = process.env.PORT || 1677

app.get('/', async (req, res) => {
    res.send(await twitch_channels())
})

app.listen(port, () => {

    console.log(`Example app listening on port ${port}`)
})

async function twitch_channels() {
    try {

        // Authorize the client
        const token = await authClient.authorize();

        // Set the client credentials
        authClient.setCredentials(token);

        // Get the rows
        const res = await service.spreadsheets.values.get({
            auth: authClient,
            spreadsheetId: "13gAlL6D8nse4vCHOtB54O-MeVYgw5sBrUWjBK7p4bgY",
            range: "B:B",
        });

        // All of the answers
        const channels = [];

        // Set rows to equal the rows
        const rows = res.data.values;

        // Check if we have any data and if we do add it to our answers array
        if (rows.length) {
            rows.shift() // Remove the headers
            for (const row of rows) {
                channels.push(row[0])
            }

        } else {
            console.log("No data found.");
        }

        return channels

    } catch (error) {

        // Log the error
        console.log(error);

        // Exit the process with error
        process.exit(1);

    }

}