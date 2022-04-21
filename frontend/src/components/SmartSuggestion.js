import AppContainer from './Container';
import { 
    TextField,
    Stack,
    Paper,
    Box,
    Button,
    IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const SuggestionBox = styled(Box)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    alignItems: 'center',
    border: '1px dashed grey',
    color: '#000000',
    width: '36vw'
}));

const SuggestionItem = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    alignItems: 'center',
    color: '#000000',
    width: '16vw'
}));

const suggestionList = {
    'db1.c2.t2': ['hi', 'hello'], 
    'db2.c2.t3': ['hola', 'amigo'], 
    'db2.c3.t4': ['cente', 'lacartel'], 
    'db2.c3.t5': ['dm', 'testign']
}

export default function SmartSuggestion() {
    
    const [selected, setSelected] = useState([]);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState();

    function handleRemove(id) {
        const newList = selected.filter((item) => item[0]+item[1] !== id);
        setSelected(newList);
    }

    function handleAdd(from, to) {
        setSelected(selected => [...selected, [from, to]]);
    }

    const filteredSuggestions = Object.keys(suggestionList)
        .filter(key => key.toLowerCase().includes(from))
        .reduce((obj, key) => {
            obj[key] = suggestionList[key];
            return obj;
        }, {});

    const Suggestion = ({ from, to }) => {
        return(
            <Stack direction={'row'} alignItems={'center'}>
                <SuggestionBox>
                    <Stack spacing={2} direction={'row'} alignItems={'center'}>
                        <SuggestionItem> {from} </SuggestionItem>
                        <ArrowForwardIcon style={{ color: "#FFFFFF" }}/>
                        <SuggestionItem> {to} </SuggestionItem>
                    </Stack>
                </SuggestionBox>
                <IconButton 
                    disableRipple
                    onClick={() => handleAdd(from, to)}
                >
                    <AddBoxIcon                 
                        style={{ 
                            backgroundColor: '#4bad7b', 
                            borderRadius:3
                        }} 
                    />
                </IconButton>
            </Stack>
        )
    }

    const Selection = ({ from, to }) => {
        return(
            <Stack direction={'row'} alignItems={'center'}>
                <SuggestionBox>
                    <Stack spacing={2} direction={'row'} alignItems={'center'}>
                        <SuggestionItem> {from} </SuggestionItem>
                        <ArrowForwardIcon style={{ color: "#FFFFFF" }}/>
                        <SuggestionItem> {to} </SuggestionItem>
                    </Stack>
                </SuggestionBox>
                <IconButton 
                    disableRipple
                    onClick={() => handleRemove(from+to)}
                >
                    <RemoveCircleIcon                 
                        style={{ 
                            backgroundColor: '#d77272', 
                            borderRadius:3
                        }} 
                    />
                </IconButton>
            </Stack>
        )
    }

    return (
        <AppContainer>
            <Stack spacing={4} alignItems='center' paddingTop='3em' >
                <Stack direction='row' alignItems='inherit' spacing={5}>
                    <Stack direction='row' spacing='5vw'>
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
                        onClick={() => handleAdd([from, to])}
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
                        paddingLeft='2vw'
                        paddingRight='2vw'
                    >

                        <Stack spacing='1em'>
                            <div>Suggestions</div>
                            <Box
                                sx={{
                                    width: '40.1vw',
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
                                        <Suggestion key={key+label} from={key} to={label}/>
                                        )                                           
                                    )}
                                </Stack>
                            </Box>
                        </Stack>


                        <Stack spacing='1em'>
                            <div>Selected</div>
                            <Box
                                sx={{
                                    width: '40vw',
                                    height: 350,
                                    overflow: 'auto'
                                }}
                            >   
                                <Stack
                                    direction='column'
                                    spacing='10px'
                                >
                                    {selected.map((label) => (
                                        <Selection key={label[0]+label[1]} from={label[0]} to={label[1]}/>
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