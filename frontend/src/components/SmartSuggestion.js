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
    'db1.c2.t2': [], 
    'db2.c2.t3': [], 
    'db2.c3.t4': [], 
    'db2.c3.t5': []
}

export default function SmartSuggestion() {
    const [selected, addSelected] = useState([]);
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
                        />
                        <TextField 
                            id="input-to" 
                            label="To" 
                            variant="outlined"
                            style = {{width: '30vw'}}
                            sx={{ input: { color: 'white' }}}
                        />
                    </Stack>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        color='success'
                        disableRipple
                        size='large'
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
                                    width: '38vw',
                                    height: 350,
                                    overflow: 'auto'
                                }}
                            >   
                                <Stack
                                    direction='column'
                                    spacing='10px'
                                >
                                    <Suggestion>Item1</Suggestion>
                                    <Suggestion>Item1</Suggestion>
                                    <Suggestion>Item1</Suggestion>
                                    <Suggestion>Item1</Suggestion>
                                    <Suggestion>Item1</Suggestion>
                                    <Suggestion>Item1</Suggestion>
                                    <Suggestion>Item1</Suggestion>
                                    <Suggestion>Item1</Suggestion>
                                    <Suggestion>Item1</Suggestion>
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
                                    <Suggestion>Item1</Suggestion>
                                    <Suggestion>Item1</Suggestion>
                                    <Suggestion>Item1</Suggestion>
                                    <Suggestion>Item1</Suggestion>
                                    <Suggestion>Item1</Suggestion>
                                    <Suggestion>Item1</Suggestion>
                                    <Suggestion>Item1</Suggestion>
                                    <Suggestion>Item1</Suggestion>
                                    <Suggestion>Item1</Suggestion>
                                </Stack>
                            </Box>
                        </Stack>
                    </Stack>
                </Box>    

            </Stack>
        </AppContainer>
    )
}