import { useState } from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Divider,
    Box,
    Typography,
    Toolbar,
    AppBar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ListAltIcon from '@mui/icons-material/ListAlt';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function UserSideBar() {
    const [mobileOpen, setMobileOpen] = useState(false); // Toggle mobile drawer

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen); // Toggle open state for drawer
    };

    // Navigation items for the sidebar
    const navItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Orders', icon: <ListAltIcon />, path: '/orders' },
        { text: 'Items to Review', icon: <RateReviewIcon />, path: '/reviews' },
        { text: 'Track Order', icon: <LocalShippingIcon />, path: '/track-order' },
        { text: 'My Cart', icon: <ShoppingCartIcon />, path: '/cart' },
        { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
    ];

    const drawerWidth = 240; // Width of the sidebar

    const drawer = (
        <Box sx={{ width: drawerWidth, backgroundColor: 'lightgrey' }}> {/* Set the background color here */}
            <Typography variant="h6" sx={{ p: 2, textAlign: 'center' }}>
                User Dashboard!
            </Typography>
            <Divider />
            <List>
                {navItems.map((item, index) => (
                    <ListItem button key={index} component="a" href={item.path}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex',}}>
            {/* AppBar for mobile menu button */}
            <AppBar
                position="fixed"
                sx={{ width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { md: `${drawerWidth}px` } }}
            >
                <Toolbar sx={{backgroundColor: 'lightgrey'}}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }} // Show only on mobile
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                    
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Drawer for mobile and desktop */}
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="user navigation"
            >
                {/* Temporary Drawer for mobile */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' }, // Show on small screens
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: 'lightgrey' }, // Set the background color for mobile drawer
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Permanent Drawer for desktop */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' }, // Hide on small screens
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: 'lightgrey' }, // Set the background color for desktop drawer
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
}

export default UserSideBar;
