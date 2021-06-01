import React from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import {useState, useEffect} from 'react';
import MuiAlert from '@material-ui/lab/Alert';

// Initializam Socket
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:8000";

// Componenta de Alert
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// Headerul tabelului
const columns = [
    { id: 'ziua', label: 'Ziua', minWidth: 100 },
    { id: 'ora', label: 'Ora', minWidth: 100 },
    { id: 'intensitate', label: 'Intensitate', minWidth: 50 },
    { id: 'stadiu', label: 'Stadiu', minWidth: 100 }
];


// Functia prin care cream un rand de date
function createData(date, intensitate) {
        
    let stadiu;

    if (intensitate <= 400) {
        stadiu = <Alert severity="info">Copilul a avut miscari obisnuite!</Alert>;
    }

    if (intensitate > 400) {
        stadiu = <Alert severity="error">Copilul a plans!</Alert>;
    }

    var ziua = new Date().toISOString().slice(0, 10);
    var ora = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    return { ziua, ora, intensitate, stadiu};
}
  
  
const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: "99vh",
    },
});

// Componenta aplicatiei
const Aplicatie = () => {

    const [rows, setRows] = useState([]);
    const [miscariObisnuite, setMiscariObisnuite] = useState(0);
    const [miscariAlarmante, setMiscariAlarmante] = useState(0);

    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };


    // Functia pe care o folosim pentru a adauga automat
    // Datele primite prin socket real-time
    useEffect(() => {
      const socket = socketIOClient(ENDPOINT);
      socket.on("FromAPI", data => {
        console.log(data)
        
        if (data <= 400) {
            setMiscariObisnuite(old => old+1);
        } else {
            setMiscariAlarmante(old => old+1);
        }

        setRows(old => [...old, createData(new Date(),data)]);
      });

      return () => socket.disconnect();
    }, []);


    return (
        <div className="App">
            <Grid container spacing={3} style={{margin: "30px"}}>
                <Grid item xs={12} md={6}>
                    <Paper className={classes.root}>
                        <TableContainer className={classes.container}>
                            <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    >
                                    {column.label}
                                    </TableCell>
                                ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows && (rows != [] ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                        <TableCell key={column.id} align={column.align}>
                                            {column.format && typeof value === 'number' ? column.format(value) : value}
                                        </TableCell>
                                        );
                                    })}
                                    </TableRow>
                                );
                                }) : '')}
                            </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper style={{textAlign: "left", padding: "30px"}}>
                        <h3>Proiect realizat de Ilie Andrei-Leonard</h3>
                        <p>Acest proiect a fost realizat in cadrul cursului de ADIV 2021.</p>
                        <div>
                            <p>Tehnologii folosite: </p>
                            <ul>
                                <li><b>Hardware</b>: Arduino UNO + Modul Microfon</li>
                                <li><b>Backend (Server)</b>: NodeJS</li>
                                <li><b>Frontend (Web)</b>: ReactJS</li>
                                <li><b>Limbaje folosite</b>: HTML, CSS, JS, Arduino</li>
                            </ul>
                        </div>
                        <Alert severity="info">Mișcări obișnuite în ultima noapte: {miscariObisnuite}</Alert>
                        <Alert severity="error" style={{marginTop: "20px"}}>Plânsete în ultima noapte: {miscariAlarmante}</Alert>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default Aplicatie;