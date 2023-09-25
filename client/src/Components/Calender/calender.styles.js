import styled from 'styled-components';
import {Calendar} from "primereact/calendar";
import {ProgressSpinner} from "primereact/progressspinner";
import {DataTable} from "primereact/datatable";

export const StyledDiv = styled.div({
  textAlign: 'center',
})
  export const StyleCalendarContainer = styled.div({
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: "20px",
        justifyContent: 'center',
        gap: '1rem'
  })

  export const StyleCalendarDate = styled(Calendar)({
    width:'30vw'
  })

  export const StyledSpinner = styled(ProgressSpinner)({
    display: "flex",
    alignItems: "center",
    marginTop: 50,
  })

  export const StyledDataTable = styled(DataTable)({
    marginTop: 20,
    marginHorizontal: 80,
    textAlign:'center'
  })
