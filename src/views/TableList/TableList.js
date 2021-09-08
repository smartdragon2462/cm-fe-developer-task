/* eslint-disable prettier/prettier */
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { departments } from "../../assets/data/HR.json";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);

export default function TableList() {
  const classes = useStyles();
  const [tableHead, setTableHead] = React.useState(null);
  const [tableData, setTableData] = React.useState(null);
  const [userTableData, setUserTableData] = React.useState(null);
  const [selectedInd, setSelectedInd] = React.useState(-1);

  //////////////////////////////////////////////////////////////////////
  const handleInitialHRTable = () => {
    let tHeads = Object.keys(departments[0]).map((key) => key.charAt(0).toUpperCase() + key.slice(1));
    let tDataArr = departments.map((item) => [
      item.id.toString(),
      item.department,
      item.location,
      item.manager.name.first + " " + item.manager.name.last,
    ]);

    setTableHead(() => tHeads);
    setTableData(() => tDataArr);

    let selectedIdx = Number(localStorage.getItem('selectedInd'));
    if (selectedIdx >= 0) setSelectedInd(selectedIdx);
  };

  //////////////////////////////////////////////////////////////////////
  React.useEffect(() => {
    handleInitialHRTable();
  }, []);

  React.useEffect(() => {
    if (selectedInd >= 0) {
      localStorage.setItem('selectedInd', selectedInd);
      let selectedDepartment = tableData[selectedInd][1];

      fetch(`https://randomuser.me/api/?seed=${selectedDepartment}&results=10`)
        .then((res) => res.json())
        .then((res) => {
          let dataArr = [];
          res.results.map((item) =>
            dataArr.push([
              item.name.first + " " + item.name.last,
              item.gender,
              item.email,
              item.phone,
              item.location.street.name + " " + item.location.street.number,
            ])
          );
          setUserTableData(() => dataArr);
        }).catch(
          setUserTableData(null)
        );
    }
  }, [selectedInd]);

  //////////////////////////////////////////////////////////////////////
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>Table 1</h4>
            <p className={classes.cardCategoryWhite}>
              HR departments table
            </p>
          </CardHeader>
          <CardBody>
            {tableData && (
              <Table
                tableHeaderColor="info"
                tableHead={tableHead}
                tableData={tableData}
                selectedInd={selectedInd}
                setSelectedInd={setSelectedInd}
                selOption={true}
              />
            )}
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="success">
            <h4 className={classes.cardTitleWhite}>
              Table 2
            </h4>
            <p className={classes.cardCategoryWhite}>
              Users table
            </p>
          </CardHeader>
          <CardBody>
            {userTableData && (
              <Table
                tableHeaderColor="success"
                tableHead={["Name", "Gender", "Email", "Phone", "Address"]}
                tableData={userTableData}
                selOption={false}
              />
            )}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
