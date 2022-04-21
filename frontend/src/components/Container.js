import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    components: {
        MuiButton: { 
            styleOverrides: { 
                root: { maxHeight: '3em'} 
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
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: "#6b6b6b #2b2b2b",
                    "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                        backgroundColor: "#2b2b2b",
                },
                "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                    borderRadius: 8,
                    backgroundColor: "#6b6b6b",
                    minHeight: 24,
                    border: "3px solid #2b2b2b",
                },
                "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
                    backgroundColor: "#959595",
                },
                "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
                    backgroundColor: "#959595",
                },
                "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#959595",
                },
                "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
                    backgroundColor: "#2b2b2b",
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
                <Container component="main" maxWidth="sm" overflow='auto'>
                    {children}
                </Container>
                </ThemeProvider>
            </header>
        </div>
    );
}