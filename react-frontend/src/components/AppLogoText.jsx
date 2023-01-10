import { Box, Typography } from '@mui/material';
import { DEVEL } from './Constants';


const AppLogoText = (props) => {
    return (
        <Box>
        <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'sans-serif',
                fontWeight: 700,
                letterSpacing: '-.05rem',
                color: 'orange',
                textDecoration: 'none',
                textShadow: '1px 1px 1px black'
            }}
        >
            MakeIt Labs
        </Typography>
        <Typography
            variant="overline"
            noWrap
            component="a"
            sx={{
                mt: '-15px',
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'sans-serif',
                fontWeight: 200,
                letterSpacing: '.25rem',
                color: 'orange',
                textDecoration: 'none',
                textShadow: '1px 1px 1px black'
            }}
        >
            {DEVEL === 'yes' ? "DEVELOPMENT" : "MEMBER PORTAL"}
        </Typography>
    </Box>
    );
}

export default AppLogoText;
