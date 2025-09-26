import React, { useState } from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';
import { Stepper } from '@progress/kendo-react-layout';

interface OnboardingStepperProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFirstTask: () => void;
}

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({ 
  isOpen, 
  onClose, 
  onCreateFirstTask 
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      label: 'Welcome',
      content: (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>🎉 Welcome to Smart Task Manager+</h2>
          <p>Manage your tasks intelligently and motivationally!</p>
        </div>
      )
    },
    {
      label: 'Create a task',
      content: (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>📝 Create your first task</h2>
          <p>Use the "New Task" button or press <kbd>N</kbd></p>
        </div>
      )
    },
    {
      label: 'Organize',
      content: (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>🎯 Organize your tasks</h2>
          <p>Drag and drop between columns or use Grid/Kanban views</p>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onCreateFirstTask();
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog
      title="Getting Started Guide"
      onClose={onClose}
      visible={true}
      width={500}
      height={400}
    >
      <div style={{ padding: '1rem' }}>
        <Stepper 
          value={currentStep}
          items={steps.map(step => ({ label: step.label }))}
          style={{ marginBottom: '2rem' }}
        />
        
        {steps[currentStep].content}
      </div>

      <DialogActionsBar>
        <Button 
          onClick={handlePrev} 
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button 
          themeColor="primary" 
          onClick={handleNext}
        >
          {currentStep === steps.length - 1 ? 'Get Started!' : 'Next'}
        </Button>
      </DialogActionsBar>
    </Dialog>
  );
};