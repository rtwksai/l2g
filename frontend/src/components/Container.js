import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { maxHeight } from '@mui/system';

const theme = createTheme({
    components: {
        MuiButton: { 
            styleOverrides: { 
                root: { minWidth: '6em', maxHeight: '3em'} 
            } 
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                '& label': {
                    color: '#FFFFFF',
                },
                '& label.Mui-focused': {
                    color: '#FFFFFF',
                },
                '& .MuiInput-underline:after': {
                    borderBottomColor: '#FFFFFF',
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#FFFFFF',
                    },
                    '&:hover fieldset': {
                        borderColor: '#FFFFFF',
                        borderWidth: '0.15rem',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#FFFFFF',
                    },
                },
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    textTransform: 'initial',
                    fontSize: '1rem',
                },
            },
        },
    },
});

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


export default function AppContainer({children}) {
    return (
        <div className="App">
            <header className="App-header">
                <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar
                    position="absolute"
                    color="default"
                >
                    <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                        L2G Schema Mapping Application
                    </Typography>
                    </Toolbar>
                </AppBar>
                <Container component="main" maxWidth="sm">
                    {children}
                </Container>
                </ThemeProvider>
            </header>
        </div>
    );
}