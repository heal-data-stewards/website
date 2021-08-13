import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { getAllUsers } from "utils/api";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstname", headerName: "First Name", width: 150 },
  { field: "lastname", headerName: "Last Name", width: 150 },
  {
    field: "username",
    headerName: "User Name",
    width: 150,
  },
  {
    field: "email",
    headerName: "Email",
    width: 150,
  },
  {
    field: "org",
    headerName: "Organization",
    width: 150,
  },
];
function createData(id, firstname, lastname, username, email, org) {
  return { id, firstname, lastname, username, email, org };
}

export default function DataTable() {
  const [users, setUsers] = useState([]);
  // Call the strapi API to GET all users
  useEffect(() => {
    getAllUsers()
      .then(function (result) {
        return result.map((user, x) => {
          return createData(
            x,
            user.firstname,
            user.lastname,
            user.username,
            user.email,
            user.organization
          );
        });
      })
      .then((result) => {
        setUsers(result);
      });
  }, []);
  return (
    <div
      style={{ height: 400, width: "100%" }}
      className={"container mt-10 mb-8"}
    >
      <DataGrid
        rows={users}
        columns={columns}
        pageSize={5}
        style={{ backgroundColor: "#f3f4f6" }}
        checkboxSelection
      />
    </div>
  );
}

// const useStyles1 = makeStyles((theme) => ({
//   root: {
//     flexShrink: 0,
//     marginLeft: theme.spacing(2.5),
//   },
// }));

// function TablePaginationActions(props) {
//   const classes = useStyles1();
//   const theme = useTheme();
//   const { count, page, rowsPerPage, onChangePage } = props;

//   const handleFirstPageButtonClick = (event) => {
//     onChangePage(event, 0);
//   };

//   const handleBackButtonClick = (event) => {
//     onChangePage(event, page - 1);
//   };

//   const handleNextButtonClick = (event) => {
//     onChangePage(event, page + 1);
//   };

//   const handleLastPageButtonClick = (event) => {
//     onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
//   };

//   return (
//     <div className={classes.root}>
//       <IconButton
//         onClick={handleFirstPageButtonClick}
//         disabled={page === 0}
//         aria-label="first page"
//       >
//         {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
//       </IconButton>
//       <IconButton
//         onClick={handleBackButtonClick}
//         disabled={page === 0}
//         aria-label="previous page"
//       >
//         {theme.direction === "rtl" ? (
//           <KeyboardArrowRight />
//         ) : (
//           <KeyboardArrowLeft />
//         )}
//       </IconButton>
//       <IconButton
//         onClick={handleNextButtonClick}
//         disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//         aria-label="next page"
//       >
//         {theme.direction === "rtl" ? (
//           <KeyboardArrowLeft />
//         ) : (
//           <KeyboardArrowRight />
//         )}
//       </IconButton>
//       <IconButton
//         onClick={handleLastPageButtonClick}
//         disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//         aria-label="last page"
//       >
//         {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
//       </IconButton>
//     </div>
//   );
// }

// TablePaginationActions.propTypes = {
//   count: PropTypes.number.isRequired,
//   onChangePage: PropTypes.func.isRequired,
//   page: PropTypes.number.isRequired,
//   rowsPerPage: PropTypes.number.isRequired,
// };

// const useStyles2 = makeStyles({
//   table: {
//     minWidth: 500,
//   },
//   tableContainer2: { backgroundColor: "#f3f4f6" },
// });

// export default function CustomPaginationActionsTable() {
//   const classes = useStyles2();
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [users, setUsers] = useState([]);

//   const emptyRows =
//     rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   return (
//     <>
//       <TableContainer
//         component={Paper}
//         className={classes.tableContainer2 + " " + "container mt-10 mb-8"}
//       >
//         {console.log(users)}
//         <Table className={classes.table} aria-label="custom pagination table">
//           <TableBody>
//             {(rowsPerPage > 0
//               ? users.slice(
//                   page * rowsPerPage,
//                   page * rowsPerPage + rowsPerPage
//                 )
//               : users
//             ).map((row) => (
//               <TableRow key={row.name}>
//                 <TableCell component="th" scope="row">
//                   {row.name}
//                 </TableCell>
//                 <TableCell style={{ width: 160 }} align="right">
//                   {row.email}
//                 </TableCell>
//                 <TableCell style={{ width: 160 }} align="right">
//                   {row.org}
//                 </TableCell>
//               </TableRow>
//             ))}

//             {emptyRows > 0 && (
//               <TableRow style={{ height: 53 * emptyRows }}>
//                 <TableCell colSpan={6} />
//               </TableRow>
//             )}
//           </TableBody>
//           <TableFooter>
//             <TableRow>
//               <TablePagination
//                 rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
//                 colSpan={3}
//                 count={users.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 SelectProps={{
//                   inputProps: { "aria-label": "rows per page" },
//                   native: true,
//                 }}
//                 onChangePage={handleChangePage}
//                 onChangeRowsPerPage={handleChangeRowsPerPage}
//                 ActionsComponent={TablePaginationActions}
//               />
//             </TableRow>
//           </TableFooter>
//         </Table>
//       </TableContainer>

//     </>
//   );
// }
