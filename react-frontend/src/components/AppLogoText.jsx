import { Box, Typography } from '@mui/material';


const AppLogoText = (props) => {
    return (
        <Box sx={{ userSelect: 'none' }} onClick={props.onClick}>
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
                        letterSpacing: '.15rem',
                        color: 'orange',
                        textDecoration: 'none',
                        textShadow: '1px 1px 1px black'
                    }}
                >
                    {props.devel === 'yes' ? "DEVELOPMENT" : "MEMBER PORTAL"}
                </Typography>
        </Box>
    );
}

export default AppLogoText;
