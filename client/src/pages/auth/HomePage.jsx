import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  IconButton,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  createTheme,
  ThemeProvider,
  Paper,
  styled
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SecurityIcon from '@mui/icons-material/Security';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1e40af',
      light: '#3b82f6',
      dark: '#1e3a8a'
    },
    secondary: {
      main: '#facc15',
      light: '#fde047',
      dark: '#eab308'
    },
    background: {
      default: '#ffffff',
      paper: '#f8fafc'
    }
  },
  typography: {
    fontFamily: 'Inter, system-ui, Arial, sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      '@media (max-width:900px)': {
        fontSize: '2.5rem'
      }
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      '@media (max-width:900px)': {
        fontSize: '2rem'
      }
    },
    h5: {
      fontWeight: 600
    },
    button: {
      fontWeight: 600,
      textTransform: 'none'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 24px'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          overflow: 'visible'
        }
      }
    }
  }
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.drawer + 1
}));

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(12, 0),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '@media (max-width:900px)': {
    padding: theme.spacing(8, 0)
  }
}));

const FeatureCard = styled(motion(Paper))(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'white',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  '&:hover': {
    boxShadow:
      '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'
  }
}));

const RoleCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'white',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)'
  }
}));

const HomePage = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'roles', label: 'Roles' }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setDrawerOpen(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <StyledAppBar>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                sx={{
                  flexGrow: 1,
                  fontWeight: 800,
                  color: 'primary.main',
                  fontSize: '1.5rem'
                }}
              >
                CampusFlow
              </Typography>

              {isMobile ? (
                <IconButton
                  onClick={() => setDrawerOpen(true)}
                  sx={{ color: 'primary.main' }}
                >
                  <MenuIcon />
                </IconButton>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'white'
                        }
                      }}
                    >
                      {section.label}
                    </Button>
                  ))}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/login')}
                    startIcon={<LoginIcon />}
                  >
                    Get Started
                  </Button>
                </Box>
              )}
            </Toolbar>
          </Container>
        </StyledAppBar>

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: 250, pt: 2 }}>
            <List>
              {sections.map((section) => (
                <ListItem
                  button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                >
                  <ListItemText primary={section.label} />
                  <ChevronRightIcon color="primary" />
                </ListItem>
              ))}
              <Divider sx={{ my: 2 }} />
              <ListItem
                button
                onClick={() => navigate('/login')}
                sx={{ color: 'primary.main' }}
              >
                <ListItemText primary="Login" />
                <LoginIcon />
              </ListItem>
            </List>
          </Box>
        </Drawer>

        <HeroSection id="hero">
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Typography variant="h1" gutterBottom>
                    Transform Your Campus Events
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}
                  >
                    Streamline your college events, hackathons, and internships
                    with our comprehensive management platform
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                  >
                    Get Started Now
                  </Button>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80"
                    alt="Campus Events"
                    sx={{
                      width: '100%',
                      maxWidth: '600px',
                      borderRadius: '16px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                      display: 'block',
                      margin: '0 auto'
                    }}
                  />
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </HeroSection>

        <Box id="features" sx={{ py: 12, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h2"
                align="center"
                gutterBottom
                color="primary"
                sx={{ mb: 8 }}
              >
                Powerful Features
              </Typography>
              <Grid container spacing={4}>
                {[
                  {
                    icon: (
                      <EventIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                    ),
                    title: 'Event Management',
                    content:
                      'Create and manage campus events with automated notifications and real-time updates'
                  },
                  {
                    icon: (
                      <GroupIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                    ),
                    title: 'Team Collaboration',
                    content:
                      'Enable seamless team formation and collaboration with integrated communication tools'
                  },
                  {
                    icon: (
                      <AssessmentIcon
                        sx={{ fontSize: 48, color: 'primary.main' }}
                      />
                    ),
                    title: 'Analytics Dashboard',
                    content:
                      'Track event metrics and engagement with comprehensive analytics and reporting'
                  }
                ].map((feature, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <FeatureCard
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ color: 'primary.main' }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.content}
                      </Typography>
                    </FeatureCard>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Container>
        </Box>

        <Box id="roles" sx={{ py: 12, bgcolor: 'secondary.main' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              align="center"
              gutterBottom
              sx={{ mb: 8, color: 'primary.main' }}
            >
              Designed For Everyone
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {[
                {
                  title: 'Super Admin',
                  content:
                    'Create and manage the entire college database, create user IDs, and set up the system.',
                  icon: (
                    <SecurityIcon
                      sx={{ fontSize: 40, color: 'primary.main' }}
                    />
                  )
                },
                {
                  title: 'Principal/Dean',
                  content:
                    'View events, access detailed reports by year, department, and class.',
                  icon: (
                    <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  )
                },
                {
                  title: 'Innovation Cell',
                  content:
                    'Create, delete, and manage events, manage students, and view reports.',
                  icon: (
                    <EventIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  )
                },
                {
                  title: 'HOD',
                  content:
                    'View department-specific details, staff, and student information.',
                  icon: (
                    <GroupIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  )
                },
                {
                  title: 'Staffs',
                  content:
                    'View class student details, manage mentored teams, and submit event reports.',
                  icon: (
                    <GroupIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  )
                },
                {
                  title: 'Students',
                  content:
                    'Register for events, form teams, and submit proofs after events.',
                  icon: (
                    <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  )
                }
              ].map((role, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={index}
                  sx={{ display: 'flex' }}
                >
                  <RoleCard elevation={2} sx={{ flex: 1 }}>
                    <CardContent
                      sx={{
                        height: '100%',
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Box sx={{ mb: 3 }}>{role.icon}</Box>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ color: 'primary.main' }}
                      >
                        {role.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 3, flexGrow: 1 }}
                      >
                        {role.content}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        endIcon={<ChevronRightIcon />}
                        sx={{ mt: 'auto', alignSelf: 'flex-start' }}
                      >
                        Learn More
                      </Button>
                    </CardContent>
                  </RoleCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        <Box sx={{ py: 6, bgcolor: 'primary.main', color: 'white' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                  CampusFlow
                </Typography>
                <Typography variant="body2">
                  Empowering educational institutions with modern event
                  management solutions
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  Resources
                </Typography>
                <List dense>
                  <ListItem button>
                    <ListItemText primary="Documentation" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Support" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="API Status" />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  Legal
                </Typography>
                <List dense>
                  <ListItem button>
                    <ListItemText primary="Privacy Policy" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Terms of Service" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Cookie Policy" />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
            <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.1)' }} />
            <Typography variant="body2" align="center" sx={{ opacity: 0.8 }}>
              © 2024 CampusFlow. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;
