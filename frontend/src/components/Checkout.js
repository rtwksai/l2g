import * as React from 'react';
import Box from '@mui/material/Box';
import AppContainer from './Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import FileUpload from './FileUpload';
import SelectType from './SelectType';
import SqlForm from './SqlForm';
import ControlledTreeView from './TreeView';

// npm i @material-ui/lab

const sql_steps = ['Select Schema Type', 'Upload Local Schema', 'View Local Schema', 'Obtain Global Schema'];
const csv_steps = ['Select Schema Type', 'Upload Local Schema', 'View Local Schema', 'Obtain Global Schema'];
const steps = ['Select Schema Type', 'Upload Local Schema', 'View Local Schema', 'Obtain Global Schema'];


export default function Checkout() {
  
  const [activeStep, setActiveStep] = React.useState(0);
  const [schemaType, setSchemaType] = React.useState('');


  function onChange_schemaType(newSchemaType) {   
    setSchemaType(newSchemaType);
  }


  function getStepContent(step) {    
    switch (step) {
      case 0:
        return <SelectType onChange_sT={onChange_schemaType} />;
      case 1:
        console.log(schemaType);
        if(schemaType == 'sql')
        {
          return <SqlForm />;
        }
        
        return <FileUpload />;
      case 2:
        return <ControlledTreeView />;
      default:
        throw new Error('Unknown step');
    }
  }

  console.log(schemaType);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
      <AppContainer>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 1 }}
                  >
                    {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </AppContainer>
  );
}