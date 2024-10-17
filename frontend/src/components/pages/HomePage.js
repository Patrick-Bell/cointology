import {useState, useEffect } from 'react';
import { Box, Button, Typography, Grid, List, ListItem, ListItemText, Collapse, Container, TextField, IconButton } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Send, TrackChanges, Stars, Payment, Favorite } from '@mui/icons-material';
import Image from '../styles/hero.webp';
import sellCoin from '../styles/sell-coin-2.webp'
import axios from 'axios'
import HomeProductCard from '../ProductCard/HomeProductCard'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { Search } from '@mui/icons-material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import { ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import footerBackground from '../styles/background.png'
import { motion } from 'framer-motion'
import ScrollInView from '../animation/ScrollInView';
import Footer from '../Reuseable/Footer';




function HomePage() {

    const featureVariants = {
        hidden: (direction) => ({
            opacity: 0,
            x: direction === 'left' ? -200 : direction === 'right' ? 200 : 0,
            y: direction === 'top' ? -200 : direction === 'bottom' ? 200 : 0,
        }),
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 30,
            }
        }
    };

    const [openIndex, setOpenIndex] = useState(null);
    const [products, setProducts] = useState([])

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products')
            console.log(response.data)
            const sale = response.data
            console.log(sale)
            setProducts(sale)

        }catch(e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const steps = [
        {
            title: '1. Take a Picture',
            description: 'Capture clear images of your coin from different angles.',
        },
        {
            title: '2. Send Us the Picture',
            description: 'Upload the images using our submission form below. It will also be useful and speed up the process if you sent us a message where you got the coin from or any documentation you recieved when purchasing the coin.',
        },
        {
            title: '3. Free Evaluation',
            description: 'Our team of experts will assess the condition and value of your coin. We will contact you and show you the evaluation of the coin',
        },
        {
            title: '4. Receive an Offer',
            description: 'If it meets our criteria, we will make you an offer to buy it.',
        },
        {
            title: '5. Get Paid',
            description: "If you accept the offer, you’ll receive payment quickly and securely! If you'd prefer to exchange the coin with another on our website, that is something we can also provide.",
        },
    ];


    return (
        <>
        <Box sx={{overflow:'hidden', background:'black'}}>
            <Box
                sx={{
                    position: 'relative', // Allows absolute positioning for children
                    width: '100%',
                    height: '100vh', // Full height of the viewport
                    marginTop: '64px',
                    overflow: 'hidden', // Hide overflow
                }}
            >
                {/* Full-width Image */}
                <img
                    src={Image} // Adjust the path as needed
                    alt="Hero"
                    style={{
                        height: '100%', // Set to full height
                        width: '100%', // Set to full width
                        objectFit: 'cover', // Ensure the image covers the entire area
                    }}
                />

                {/* Text Overlay */}
                <Box
                    sx={{
                        position: 'absolute', // Position it over the image
                        top: '50%', // Center vertically
                        left: '40px', // Align to the left with some padding
                        transform: 'translateY(-50%)', // Adjust to truly center
                        color: 'white', // Change text color for readability
                        padding: '20px', // Add some padding for aesthetics
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Semi-transparent background for contrast
                        borderRadius: '10px'
                    }}
                >
                    <Typography variant="h2" sx={{ fontWeight: '900' }}>COINTOLOGY</Typography>
                    <Typography variant="body1" sx={{ marginTop: '16px' }}>
                        Welcome to Cointology, a marketplace dedicated to the purchase of coins!
                    </Typography>
                    <Box sx={{display:'flex'}}>
                    <ScrollInView direction='left'>
                    <Link to='/'>
                    <Button
                        variant="outlined"
                        startIcon={<Send />}
                        sx={{ marginTop: '16px', color: 'white', background:'#9c27b0'}}
                    >
                        Get Started
                    </Button>
                    </Link>
                    </ScrollInView>
                    <ScrollInView direction='left'>
                    <Link to='/register'>
                    <Button
                        variant="outlined"
                        startIcon={<Send />}
                        sx={{ marginTop: '16px', color: 'white', marginLeft:'10px'}}
                    >
                        Register!
                    </Button>
                    </Link>
                    </ScrollInView>
                </Box>
                </Box>
            </Box>

            <Box
                sx={{
                    backgroundColor: '#fbfdec', // Set background color for About Us section
                    padding: '40px', // Add padding
                }}
            >
                
            <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 0',
            }}
        >
            {/* Left Line */}
            <Box
                sx={{
                    width: '25%', // Grow the line to take as much space as possible
                    height: '2px',
                    backgroundColor: '#9c27b0',
                }}
            />

            {/* Text in the center */}
            <Typography
                variant="h4"
                sx={{
                    padding: '0 10px', // Add space between the lines and the text
                    whiteSpace: 'nowrap', // Prevent the text from breaking onto multiple lines
                }}
            >
                About Us
            </Typography>

            {/* Right Line */}
            <Box
                sx={{
                    width: '25%', // Grow the line to take as much space as possible
                    height: '2px',
                    backgroundColor: '#9c27b0',
                }}
            />
        </Box>



                <Grid container spacing={4}>
                    {/* Left Side Content */}
                    <Grid item xs={12} md={6}>
                    <ScrollInView direction='left'>
                        <Typography variant="h6" sx={{ marginBottom: '20px' }}>
                            Cointology: Your Marketplace for Coins
                        </Typography>
                        <Typography variant="body1">
                            Cointology is a premier online marketplace dedicated to enthusiasts and collectors of coins. We provide a platform where users can both purchase and sell authentic minted coins from around the world. Whether you're a seasoned collector seeking rare finds or a newcomer eager to start your collection, Cointology offers a user-friendly interface and a wide selection of coins that cater to all interests and budgets.
                            <br /><br />
                            Our marketplace ensures the authenticity and quality of every coin listed, so buyers can shop with confidence. Sellers can showcase their unique collections and connect with like-minded individuals passionate about numismatics. At Cointology, we are committed to creating a vibrant community for coin lovers, offering resources, insights, and support for all your collecting needs.
                        </Typography>
                        </ScrollInView>

                        <ScrollInView direction='bottom'>
                        <Link to='/'>
                    <Button
                        variant="outlined"
                        startIcon={<Send />}
                        sx={{ marginTop: '16px', color: 'white', background:'#9c27b0',}}
                    >
                        View our coins!
                    </Button>
                    </Link>
                    </ScrollInView>

                    </Grid>

                    {/* Right Side Content */}
                    <Grid item xs={12} md={6}>
                    <ScrollInView direction='right'>
                        <Typography variant="h6" sx={{ marginBottom: '20px' }}>
                            Our Mission
                        </Typography>
                        <Typography variant="body1">
                            At Cointology, our mission is to create a trusted and accessible marketplace for coin enthusiasts, where quality, authenticity, and customer satisfaction are at the forefront of everything we do. We strive to foster a community where collectors can connect, share their passion, and discover new opportunities. Our commitment to excellence ensures that every transaction is secure, and every customer feels valued. We aim to elevate the experience of buying and selling coins by providing exceptional service, expert knowledge, and a diverse range of high-quality coins.
                        </Typography>
                        <Typography variant="h6" sx={{ marginTop: '40px', marginBottom: '20px' }}>
                            Our Vision
                        </Typography>
                        <Typography variant="body1">
                            Our vision is to be the leading global marketplace for coin collectors and enthusiasts, recognized for our dedication to authenticity, innovation, and customer-centric service. We envision a world where collectors of all levels can easily access a vast selection of coins, engage with a supportive community, and enjoy a seamless buying and selling experience. By leveraging technology and fostering partnerships within the numismatic community, we aim to empower collectors to build, grow, and share their collections with pride.
                        </Typography>
                        </ScrollInView>
                    </Grid>
                </Grid>
            </Box>


            <ToastContainer />



            <Box sx={{ padding: '40px', background:'white' }}>

            <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 0',
            }}
        >
            {/* Left Line */}
            <Box
                sx={{
                    width: '25%', // Grow the line to take as much space as possible
                    height: '2px',
                    backgroundColor: '#9c27b0',
                }}
            />

            {/* Text in the center */}
            <Typography
                variant="h4"
                sx={{
                    padding: '0 10px', // Add space between the lines and the text
                    whiteSpace: 'nowrap', // Prevent the text from breaking onto multiple lines
                }}
            >
                Products
            </Typography>

            {/* Right Line */}
            <Box
                sx={{
                    width: '25%', // Grow the line to take as much space as possible
                    height: '2px',
                    backgroundColor: '#9c27b0',
                }}
            />
        </Box>
            

            {/* Wrap Swiper in ScrollInView for animation on scroll */}
            <ScrollInView direction="left">
                <Box
                    sx={{
                        display: 'flex', // Use flex to center the Swiper
                        justifyContent: 'center', // Center horizontally
                        alignItems: 'center', // Center vertically if needed
                        overflow: 'hidden', // Prevent horizontal scroll
                        paddingBottom: '40px', // Adds space at the bottom of the Swiper
                    }}
                >
                    <Swiper
                        spaceBetween={20} // Space between slides
                        loop={true} // Enable infinite loop mode
                        pagination={{ clickable: true, el: '.custom-pagination' }} // Enable clickable pagination
                        navigation // Enable navigation buttons
                        modules={[Navigation, Pagination]} // Register modules here
                        style={{ width: '100%', padding: '20px 0' }} // Max width for Swiper
                        breakpoints={{
                            // Define breakpoints for different screen sizes
                            640: {
                                slidesPerView: 1, // 1 slide on small screens
                            },
                            768: {
                                slidesPerView: 2, // 2 slides on medium screens
                            },
                            1024: {
                                slidesPerView: 3, // 3 slides on larger screens
                            },
                            1280: {
                                slidesPerView: 4, // 4 slides on extra-large screens
                            },
                        }}
                    >
                        {Array.isArray(products) && products.length > 0 ? (
                            products.map((item, i) => (
                                <SwiperSlide key={i} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <HomeProductCard product={item} />
                                </SwiperSlide>
                            ))
                        ) : (
                            <SwiperSlide>
                                <Typography align='center'>No products available at this time.</Typography>
                            </SwiperSlide>
                        )}
                    </Swiper>
                </Box>
            </ScrollInView>

            {/* Pagination Box Below the Swiper */}
            <Box
                className="custom-pagination" // Use a custom class for pagination
                sx={{
                    textAlign: 'center',
                    '& .swiper-pagination-bullet': {
                        width: '12px',
                        height: '12px',
                        background: 'gray', // Default bullet color
                    },
                    '& .swiper-pagination-bullet-active': {
                        background: '#9c27b0', // Active bullet color
                    },
                }}
            />
        </Box>









            {/* Features Section */}
            <Box
                sx={{
                    backgroundColor: '#e0e0e0', // New background color for Features section
                    padding: '40px', // Add padding
                }}
            >
                <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 0',
            }}
        >
            {/* Left Line */}
            <Box
                sx={{
                    width: '25%', // Grow the line to take as much space as possible
                    height: '2px',
                    backgroundColor: '#9c27b0',
                }}
            />

            {/* Text in the center */}
            <Typography
                variant="h4"
                sx={{
                    padding: '0 10px', // Add space between the lines and the text
                    whiteSpace: 'nowrap', // Prevent the text from breaking onto multiple lines
                }}
            >
                Features
            </Typography>

            {/* Right Line */}
            <Box
                sx={{
                    width: '25%', // Grow the line to take as much space as possible
                    height: '2px',
                    backgroundColor: '#9c27b0',
                }}
            />
        </Box>

                <Grid container spacing={4} justifyContent="center">
                    {/* Feature 1 */}
                    <Grid item xs={12} sm={6} md={3}>
                    <ScrollInView direction='left'>
                        <Box
                            sx={{
                                textAlign: 'center',
                                padding: '20px',
                                border: '1px solid #ccc',
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                boxShadow: 2,
                            }}
                        >
                            <TrackChanges sx={{ fontSize: '50px', color: '#9c27b0' }} />
                            <Typography variant="h6" sx={{ marginTop: '10px' }}>
                                Track Orders
                            </Typography>
                            <Typography variant="body2">
                                Track your orders from purchase to delivery seamlessly.
                            </Typography>
                        </Box>
                        </ScrollInView>
                    </Grid>

                    {/* Feature 2 */}
                    <Grid item xs={12} sm={6} md={3}>
                    <ScrollInView direction='left'>
                        <Box
                            sx={{
                                textAlign: 'center',
                                padding: '20px',
                                border: '1px solid #ccc',
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                boxShadow: 2,
                            }}
                        >
                            <Stars sx={{ fontSize: '50px', color: '#9c27b0' }} />
                            <Typography variant="h6" sx={{ marginTop: '10px' }}>
                                Unique Coins
                            </Typography>
                            <Typography variant="body2">
                                Access a diverse range of unique and rare coins.
                            </Typography>
                        </Box>
                        </ScrollInView>
                    </Grid>

                    {/* Feature 3 */}
                    <Grid item xs={12} sm={6} md={3}>
                    <ScrollInView direction='right'>
                        <Box
                            sx={{
                                textAlign: 'center',
                                padding: '20px',
                                border: '1px solid #ccc',
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                boxShadow: 2,
                            }}
                        >
                            <Payment sx={{ fontSize: '50px', color: '#9c27b0' }} />
                            <Typography variant="h6" sx={{ marginTop: '10px' }}>
                                Flexible Payments
                            </Typography>
                            <Typography variant="body2">
                                Convenient cash and card payment options available.
                            </Typography>
                        </Box>
                        </ScrollInView>
                    </Grid>

                    {/* Feature 4 */}
                    <Grid item xs={12} sm={6} md={3}>
                    <ScrollInView direction='right'>
                        <Box
                            sx={{
                                textAlign: 'center',
                                padding: '20px',
                                border: '1px solid #ccc',
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                boxShadow: 2,
                            }}
                        >
                            <Favorite sx={{ fontSize: '50px', color: '#9c27b0' }} />
                            <Typography variant="h6" sx={{ marginTop: '10px' }}>
                                Favorites
                            </Typography>
                            <Typography variant="body2">
                                Easily add coins to your favorites for quick access.
                            </Typography>
                        </Box>
                        </ScrollInView>
                    </Grid>
                </Grid>
                <Link to='/'>
                    <Button
                        variant="outlined"
                        startIcon={<Send />}
                        sx={{ display:'flex', margin: '16px auto auto', color: 'white', background:'#9c27b0',}}
                    >
                        View our coins!
                    </Button>
                    </Link>
            </Box>

            {/* Sell Your Coin Section */}
            <Box
            sx={{
                backgroundColor: '#fbfdec', // Background color for Sell Your Coin section
                padding: '40px',
            }}
        >
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 0',
            }}
        >
            {/* Left Line */}
            <Box
                sx={{
                    width: '25%', // Grow the line to take as much space as possible
                    height: '2px',
                    backgroundColor: '#9c27b0',
                }}
            />

            {/* Text in the center */}
            <Typography
                variant="h4"
                sx={{
                    padding: '0 10px', // Add space between the lines and the text
                    whiteSpace: 'nowrap', // Prevent the text from breaking onto multiple lines
                }}
            >
                Sell Your Coin
            </Typography>

            {/* Right Line */}
            <Box
                sx={{
                    width: '25%', // Grow the line to take as much space as possible
                    height: '2px',
                    backgroundColor: '#9c27b0',
                }}
            />
        </Box>

            <Grid container spacing={4}>
                {/* Left Side Content */}
                <Grid item xs={12} md={6}>
                    <List>
                        {steps.map((step, index) => (
                            <Box key={index}>
                            <motion.div custom='bottom' variants={featureVariants} initial='hidden' whileInView='visible'>
                                <ListItem button onClick={() => handleToggle(index)}>
                                    <ListItemText
                                        primary={step.title}
                                        sx={{ color: 'black' }}
                                    />
                                    {openIndex === index ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
                                    <Typography variant="body2" sx={{ paddingLeft: 2, color: 'black' }}>
                                        {step.description}
                                    </Typography>
                                </Collapse>
                                </motion.div>

                            </Box>
                        ))}
                    </List>
                    <Typography variant="body1" sx={{ marginTop: '20px', color: 'black' }}>
                        <strong>Do you have a coin you’d like to sell? At Cointology, we make it easy for you!</strong>
                        <br /><br />
                        Simply follow the steps above to send us a picture of your coin for a free evaluation. 
                        Our team of experts will assess the condition and value of your coin. If it meets our criteria, 
                        we will make you an offer to buy it. Selling your coin has never been easier!
                    </Typography>
                    <ScrollInView direction='bottom'>
                    <Button
                        variant="contained"
                        sx={{ marginTop: '20px', backgroundColor: '#9c27b0' }}
                    >
                        Send Your Coin
                    </Button>
                    </ScrollInView>
                </Grid>

                {/* Right Side Content */}
                <Grid item xs={12} md={6}>
                <ScrollInView direction='right'>
                    <img
                        src={sellCoin} // Placeholder image; replace with actual stock image later
                        alt="Sell Your Coin"
                        style={{
                            width: '100%', // Responsive width
                            borderRadius: '10px', // Rounded corners
                            boxShadow: 2,
                        }}
                    />
                </ScrollInView>
                </Grid>
            </Grid>
        </Box>



        <Box
            sx={{
                backgroundColor: '#e0e0e0', // New background color for Features section
                padding: '40px', // Add padding
                }}
            >
                
            <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 0',
            }}
        >
            {/* Left Line */}
            <Box
                sx={{
                    width: '25%', // Grow the line to take as much space as possible
                    height: '2px',
                    backgroundColor: '#9c27b0',
                }}
            />

            {/* Text in the center */}
            <Typography
                variant="h4"
                sx={{
                    padding: '0 10px', // Add space between the lines and the text
                    whiteSpace: 'nowrap', // Prevent the text from breaking onto multiple lines
                }}
            >
              FAQs
            </Typography>

            {/* Right Line */}
            <Box
                sx={{
                    width: '25%', // Grow the line to take as much space as possible
                    height: '2px',
                    backgroundColor: '#9c27b0',
                }}
            />
        </Box>





                <ScrollInView direction='top'>
            <Accordion sx={{margin: '5px 0'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          What is Cointology?
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </AccordionDetails>
      </Accordion>
      </ScrollInView>

      <ScrollInView direction='top'>
      <Accordion sx={{margin: '5px 0'}}>
      <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          How does the cash payment work?
        </AccordionSummary>
        <AccordionDetails>
          If you want to check out using cash, you select the cash option and fill out the form. Once completed, you will recieve a confirmation email and someone on our team will reach out regarding the collection details. Dependent on how far
          you live, it may take up to 2-3 days for your delivery to arrive. Cash deliveries hold a standard delivery fee of <strong>£1.99</strong> and failure to provide payment upon delivery can lead to your address being blacklisted.
        </AccordionDetails>
      </Accordion>
      </ScrollInView>

      <ScrollInView direction='top'>
      <Accordion sx={{margin: '5px 0'}}>
      <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          How can I track my order?
        </AccordionSummary>
        <AccordionDetails>
          You will recieve emails throughout the order process. If you sign up, you track your package in real time and get more updated reports on the expected delivery date of your package.
        </AccordionDetails>
      </Accordion>
      </ScrollInView>
    </Box>



<Footer/>

        
        </Box>


       

        </>
    );
}

export default HomePage;
