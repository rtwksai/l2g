import AppContainer from './Container';
import { 
    TextField,
    Stack,
    Paper,
    Box,
    Button,
    Text
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

const Suggestion = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: '#000000',
    width: '36vw'
}));

const suggestionList = {
    'db1.c2.t2': ['hi', 'hello'], 
    'db2.c2.t3': ['hola', 'amigo'], 
    'db2.c3.t4': ['cente', 'lacartel'], 
    'db2.c3.t5': ['dm', 'testign']
}

export default function SmartSuggestion() {
    
    const [selected, addSelected] = useState([]);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState();

    const filteredSuggestions = Object.keys(suggestionList)
        .filter(key => key.toLowerCase().includes(from))
        .reduce((obj, key) => {
            obj[key] = suggestionList[key];
            return obj;
        }, {});

    // console.log()

    return (
        <AppContainer>
            <Stack spacing={4} alignItems='center' paddingTop='3em' >
                <Stack direction='row' alignItems='inherit' spacing={5}>
                    <Stack
                        direction='row'
                        spacing='5vw' 
                    >
                        <TextField 
                            id="input-from" 
                            label="From" 
                            variant="outlined"
                            style = {{width: '30vw'}}
                            sx={{ input: { color: 'white' }}}
                            onChange={(e) => setFrom(e.target.value.toLowerCase())}
                        />
                        <TextField 
                            id="input-to" 
                            label="To" 
                            variant="outlined"
                            style = {{width: '30vw'}}
                            sx={{ input: { color: 'white' }}}
                            onChange={(e) => setTo(e.target.value.toLowerCase())}
                        />
                    </Stack>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        color='success'
                        disableRipple
                        size='large'
                        onClick={() => addSelected([...selected, from + ' -> ' + to])}
                    >
                        Add
                    </Button>
                </Stack>
                <Box
                    paddingTop='2em'
                    sx={{
                        p: 2, 
                        border: '1px dashed grey',
                        width: '90vw',
                        height: 450,
                    }}
                >
                    <Stack
                        direction='row'
                        spacing='5vw'
                        paddingLeft='2.5vw'
                        paddingRight='2.5vw'
                    >

                        <Stack spacing='1em'>
                            <div>Suggestions</div>
                            <Box
                                sx={{
                                    width: '38vw',
                                    height: 350,
                                    overflow: 'auto'
                                }}
                            >   
                                <Stack
                                    direction='column'
                                    spacing='10px'
                                >
                                    {Object.entries(filteredSuggestions).map( ([key, value]) =>
                                        value.map((label) => 
                                            <Suggestion key={label}>{label}</Suggestion> 
                                        )                                           
                                    )}
                                </Stack>
                            </Box>
                        </Stack>


                        <Stack spacing='1em'>
                            <div>Selected</div>
                            <Box
                                sx={{
                                    width: '38vw',
                                    height: 350,
                                    overflow: 'auto'
                                }}
                            >   
                                <Stack
                                    direction='column'
                                    spacing='10px'
                                >
                                    {selected.map((label) => (
                                        <Suggestion key={label}>{label}</Suggestion>
                                    ))}
                                </Stack>
                            </Box>
                        </Stack>
                    </Stack>
                </Box>    

            </Stack>
        </AppContainer>
    )
}