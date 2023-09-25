const BASE_URL = 'http://localhost:3001';

/* Help to convert the numeric month to characters */
const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
];

export const fetchWildfires = async (selectedDate, loading, shouldShowDialog) => {
    try {
        loading(true); // Start loading
        
        //   make month and year ready for call API
        const month = monthNames[selectedDate.getMonth()];
        console.log("months", month)
        const year = selectedDate.getFullYear();

        // Make a GET request to your Node.js API
        const response = await fetch(`${BASE_URL}/wildfires?month=${month}&year=${year}`);

        if (response.ok) {
            const data = await response.json();
            if (data.data?.length === 0) {
                shouldShowDialog(true);
            }
            return data.data;
        } else {
            console.error("Error fetching wildfire data");
        }
    } catch (error) {
        console.error("Error fetching wildfire data:", error);
    } finally {
        loading(false); // Stop loading, whether there was an error or not
    }
};