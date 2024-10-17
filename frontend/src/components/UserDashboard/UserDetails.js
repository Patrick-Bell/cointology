import React from 'react';
import {
    Typography,
    Box,
    CircularProgress,
} from '@mui/material';

function UserDetails() {
    return (
        <Box 
            sx={{
                display: 'block',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Full height to cover the entire screen
                position: 'fixed', // Fix the loader in the center of the screen
                top: 100,
                left: { xs: 0, md: 120 }, // 0px for small screens and 120px for medium and larger screens
                width: '100vw', // Full width of the screen
                zIndex: 1000, // Ensure it stays on top of other elements
                color: 'black',
                padding: 3,
                borderRadius: 2,
                textAlign: 'center'
            }}
        >
            <CircularProgress color="inherit" sx={{ marginBottom: 2 }} />
            <Typography variant="h4" sx={{ marginBottom: 1 }}>
                Coming Soon...
            </Typography>
            <Typography variant="body1">
                We are working hard to bring you this feature. Stay tuned!
            </Typography>
        </Box>
    );
}

export default UserDetails;
