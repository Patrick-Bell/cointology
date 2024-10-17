import { useState } from 'react';
import axios from 'axios';
import { Box, Grid, Paper, Typography, TextField, Button, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState(new Array(4).fill('')); // 4-digit code
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Handle email submission
    const handleEmailSubmit = async () => {
        try {
            // Check if email is entered
            if (email === '') {
                toast.error('Please enter your email.');
                return;
            }

            const response = await axios.post(`/api/send-forgot-password-email/${email}`);
            console.log(response.data);

            if (response.status === 200) {
                // Show success message and open the modal
                toast.success('Verification code sent to your email.');
                setShowModal(true); // Open the modal to enter the 4-digit code
            } 

        } catch (e) {
            console.log(e);
            toast.error(e.response.data.message);
        }
    };

    // Handle code verification
    const handleCodeVerification = async () => {
        const code = verificationCode.join(''); // Join array to form the 4-digit code
        try {
            const response = await axios.post(`/api/verify-code`, { email, code });
            console.log(response.data);
            if (response.data.message === 'Code verified') {
                toast.success('Code verified. You can now reset your password.');
                setIsCodeVerified(true); // Allow password reset
                setShowModal(false); // Close the modal
                setShowSuccessModal(true)
            } else {
                toast.error('Invalid code. Please try again.');
            }
        } catch (e) {
            console.log(e);
            toast.error('Invalid Code');
        }
    };

    return (
        <>
            <ToastContainer />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: '#f5f5f5' }}>
                <Paper elevation={3} sx={{ padding: 4, maxWidth: '400px', width: '100%' }}>
                        <>
                            <Typography variant="h5" component="h1" gutterBottom>
                                Enter Email to Reset Password
                            </Typography>
                            <TextField
                                label="Email"
                                type="email"
                                variant="outlined"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Button variant="contained" color="primary" fullWidth onClick={handleEmailSubmit}>
                                Send Verification Code
                            </Button>
                        </>
                </Paper>
            </Box>

            {/* Modal for entering verification code */}
            <Modal open={showModal} onClose={() => setShowModal(false)} sx={{ zIndex: '100'}}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Paper sx={{ padding: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Enter Verification Code
                        </Typography>
                        <Box display="flex" justifyContent="space-between">
                            {verificationCode.map((digit, index) => (
                                <TextField
                                    key={index}
                                    value={digit}
                                    onChange={(e) => {
                                        const newCode = [...verificationCode];
                                        newCode[index] = e.target.value;
                                        setVerificationCode(newCode);
                                    }}
                                    inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                                    variant="outlined"
                                    sx={{ width: 50, mx: 1 }}
                                />
                            ))}
                        </Box>
                        <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={handleCodeVerification}>
                            Verify Code
                        </Button>
                    </Paper>
                </Box>
            </Modal>

            <Modal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} sx={{ zIndex: '100' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: '#f5f5f5' }}>
                <Paper elevation={3} sx={{ padding: 4, maxWidth: '400px', width: '100%' }}>
                        <>
                            <Typography variant="h5" component="h1" gutterBottom>
                                Follow Email Instructions
                            </Typography>

                            <Typography>Please follow email instructions. This email waa sent to <strong>{email}</strong>. You will have 10 minutes to reset
                            your password. The reaosn you are restricted to 10 minutes is for security reasons.</Typography>
                           
                        </>
                </Paper>
            </Box>
            </Modal>
        </>
    );
}

export default ResetPassword;
