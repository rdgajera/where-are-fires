import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import React, {useCallback, useState} from "react";
import {Dialog} from "primereact/dialog";
import {Column} from "primereact/column";
import {fetchWildfires} from '../../utils/api'
import {
    StyleCalendarContainer,
    StyleCalendarDate,
    StyledSpinner,
    StyledDataTable,
    StyledDiv
} from "./calender.styles.js";
        

export const Calender = () => {

    const [date, setDate] = useState(null);
    const [wildfires, setWildfires] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
 
    const handleDateSelect = async(event) => {
        const selectedDate = event.value;
        setDate(selectedDate);

        /*Loader show when fetch data*/
        setLoading(true);  

        /*Fetch data on date select*/
        const wildfireResult = await fetchWildfires(selectedDate, setLoading, setShowDialog);
        setWildfires(wildfireResult);
    };

    const clearInputDate = useCallback(() =>{
        if(date) setDate(null); setWildfires([]);
    },[date])

    const dialogBox = (
        <Dialog
                visible={showDialog}
                onHide={() => setShowDialog(false)}
                header=" “Oh No!”"
                modal
                footer={<button onClick={() => setShowDialog(false)}>OK</button>}
            >
                <p>No wildfire data found for the selected date.</p>
            </Dialog>
        )

    return (
        <StyledDiv>
                <header>
                    <h1>Please Select a Date</h1>
                </header>
            <StyleCalendarContainer>
                <StyleCalendarDate
                    value={date}
                    onChange={handleDateSelect}
                    dateFormat="mm/yy"      /*Format for month and year*/ 
                    view="month"            /*Display only the month*/ 
                    placeholder="Select Month/Year"
                    showIcon                 
                />
                <button onClick={clearInputDate}>Clear</button>
            </StyleCalendarContainer>
            
            {loading && <StyledSpinner className="m-5" />}
             {wildfires?.length > 0 && !loading && (
                    <StyledDataTable value={wildfires} showGridlines>
                        <Column
                            field="name"
                            header="Name"
                            style={{textAlign: 'center'}}
                        />
                        <Column
                            field="country"
                            header="Country"
                            style={{textAlign: 'center'}}
                        />
                    </StyledDataTable>
            )} 

            {/* Dialog popup when no record found */}
            {dialogBox}
        </StyledDiv>
    );
};
