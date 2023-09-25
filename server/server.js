const express = require("express");
const axios = require("axios");
const {lookUp} = require("geojson-places");
const cors = require("cors"); // Import the cors middleware

const path = require('path'); // Import the 'path' module


const app = express();

// Serve static files from the "client/build" directory
app.use(express.static('../client/build'));

// Port on which the system will run
const PORT = 3001;

// Month Alphabetic to numeric
const monthMap = {
    JAN: "01",
    FEB: "02",
    MAR: "03",
    APR: "04",
    MAY: "05",
    JUN: "06",
    JUL: "07",
    AUG: "08",
    SEP: "09",
    OCT: "10",
    NOV: "11",
    DEC: "12",
};


/*
* Create a function to fetch wildfire events from NASA EONET
* @param: month: string
* @param: year: string
* @return Object[]
* */
async function fetchWildfires(month, year) {
    try {
        //convert Alphabetic month to numerical format
        const monthNumeric = monthMap[month.toUpperCase()];
        const startDate = `${year}-${monthNumeric}-01`;
        const endDate = `${year}-${monthNumeric}-31`;

        // Make a request to the NASA EONET API
        const response = await axios.get(
            `https://eonet.gsfc.nasa.gov/api/v3/events?start=${startDate}&end=${endDate}&category=wildfires`
        );

        // Extract and format the relevant data
        const wildfires = response.data.events.map((event) => {
            const {geometry} = event;
            const countryCode = lookUp(
                geometry[0].coordinates[1],
                geometry[0].coordinates[0]
            );

            return {
                name: event.title,
                country:
                    countryCode != null
                        ? countryCode.country_a3
                        : "Unable to find country on the map",
            };
        });
        // Sort the wildfires array by country acronym
        wildfires.sort((a, b) => {
            // Compare the country property of objects a and b
            if (a.country < b.country) return -1;
            if (a.country > b.country) return 1;
            return 0;
        });
        return wildfires;
    } catch (error) {
        throw error;
    }
}

app.use(cors());

// Define the API route

/*
* API call to return the wildfires
* @param: req:  Request<P, ResBody, ReqBody, ReqQuery, LocalsObj>
* @param: res: res: Response<ResBody, LocalsObj>
* @return Response<ResBody, LocalsObj>
* */
app.get("/wildfires", async (req, res) => {
    const {month, year} = req.query;

    // if user requests without month and year in parameters
    if (!month || !year) {
        return res.status(400).json({
            message: "Both month and year are required query parameters.",
            success: false,
        });
    }

    try {
        const wildfires = await fetchWildfires(month, year);

        // if no data wildfire against the req send this response
        if (wildfires && wildfires.length === 0) {
            res
                .status(200)
                .json({data: wildfires, success: true, message: "“Oh No!"});
        } else {
            res.status(200).json({
                data: wildfires,
                success: true,
                message: "Data Fetch Successfully",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching wildfire data.",
            success: false,
        });
    }
});


// Handle all other routes by serving the React app

/*
* API call to return the wildfires
* @param: req:  Request<P, ResBody, ReqBody, ReqQuery, LocalsObj>
* @param: res: res: Response<ResBody, LocalsObj>
* @return Response<ResBody, LocalsObj>
* */

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Start the app
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
