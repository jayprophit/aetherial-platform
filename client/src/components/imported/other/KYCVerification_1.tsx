import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../ui/Button';

interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  idType: string;
  idNumber: string;
  country: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  idType?: string;
  idNumber?: string;
  country?: string;
}

interface StepCircleProps {
  $active?: boolean;
  $completed?: boolean;
}

interface KYCVerificationProps {
  onVerificationComplete: (verified: boolean) => void;
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  text-align: center;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 2rem;
  text-align: center;
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 15px;
    left: 10%;
    right: 10%;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.border};
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
    
    &:after {
      display: none;
    }
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    flex-direction: row;
    gap: 1rem;
  }
`;

const StepCircle = styled.div<StepCircleProps>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.$active ? props.theme.colors.primary : props.$completed ? props.theme.colors.success : props.theme.colors.background};
  color: ${props => (props.$active || props.$completed) ? 'white' : props.theme.colors.textLight};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`;

const StepLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const FormContainer = styled.div`
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FileUploadContainer = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FileUploadText = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.5rem;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const AgeRestrictionNotice = styled.div`
  background-color: ${({ theme }) => theme.colors.warning};
  color: white;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-top: 2rem;
  text-align: center;
  font-weight: bold;
`;

const KYCVerification: React.FC<KYCVerificationProps> = ({ onVerificationComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    idType: 'passport',
    idNumber: '',
    country: 'US'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [userAge, setUserAge] = useState<number | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Calculate age if date of birth is changed
    if (name === 'dateOfBirth' && value) {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setUserAge(age);
    }
  };
  
  const validateStep = () => {
    const newErrors: FormErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    } else if (step === 2) {
      if (!formData.idType) newErrors.idType = 'ID type is required';
      if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
      if (!formData.country) newErrors.country = 'Country is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };
  
  const handlePrevious = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = () => {
    if (validateStep()) {
      // Simulate verification process
      setTimeout(() => {
        onVerificationComplete(true);
      }, 2000);
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <FormContainer>
            <FormGroup>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
              {errors.dateOfBirth && <ErrorMessage>{errors.dateOfBirth}</ErrorMessage>}
            </FormGroup>
            
            {userAge !== null && userAge < 18 && (
              <AgeRestrictionNotice>
                You are under 18 years old. Some platform features will be restricted, and your digital assets will be locked until you reach legal age.
              </AgeRestrictionNotice>
            )}
          </FormContainer>
        );
        
      case 2:
        return (
          <FormContainer>
            <FormGroup>
              <Label htmlFor="idType">ID Document Type</Label>
              <Select
                id="idType"
                name="idType"
                value={formData.idType}
                onChange={handleInputChange}
              >
                <option value="passport">Passport</option>
                <option value="driverLicense">Driver's License</option>
                <option value="nationalId">National ID Card</option>
              </Select>
              {errors.idType && <ErrorMessage>{errors.idType}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="idNumber">ID Number</Label>
              <Input
                type="text"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
              />
              {errors.idNumber && <ErrorMessage>{errors.idNumber}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="country">Country of Issue</Label>
              <Select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="JP">Japan</option>
                <option value="CN">China</option>
                <option value="IN">India</option>
              </Select>
              {errors.country && <ErrorMessage>{errors.country}</ErrorMessage>}
            </FormGroup>
          </FormContainer>
        );
        
      case 3:
        return (
          <FormContainer>
            <FormGroup>
              <Label>Front Side of ID</Label>
              <FileUploadContainer>
                <FileUploadText>Click to upload front side of your ID</FileUploadText>
              </FileUploadContainer>
            </FormGroup>
            
            <FormGroup>
              <Label>Back Side of ID</Label>
              <FileUploadContainer>
                <FileUploadText>Click to upload back side of your ID</FileUploadText>
              </FileUploadContainer>
            </FormGroup>
            
            <FormGroup>
              <Label>Selfie with ID</Label>
              <FileUploadContainer>
                <FileUploadText>Click to upload a selfie of you holding your ID</FileUploadText>
              </FileUploadContainer>
            </FormGroup>
          </FormContainer>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Container>
      <Title>KYC Verification</Title>
      <Description>
        Complete your identity verification to access all platform features and ensure age-appropriate restrictions.
      </Description>
      
      <StepsContainer>
        <Step>
          <StepCircle $completed={step > 1} $active={step === 1}>1</StepCircle>
          <StepLabel>Personal Information</StepLabel>
        </Step>
        <Step>
          <StepCircle $completed={step > 2} $active={step === 2}>2</StepCircle>
          <StepLabel>ID Information</StepLabel>
        </Step>
        <Step>
          <StepCircle $completed={step > 3} $active={step === 3}>3</StepCircle>
          <StepLabel>Document Upload</StepLabel>
        </Step>
      </StepsContainer>
      
      {renderStep()}
      
      <ButtonContainer>
        {step > 1 && (
          <Button $variant="outline" onClick={handlePrevious}>
            Previous
          </Button>
        )}
        
        {step < 3 ? (
          <Button $variant="primary" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button $variant="primary" onClick={handleSubmit}>
            Submit Verification
          </Button>
        )}
      </ButtonContainer>
    </Container>
  );
};

export default KYCVerification;
