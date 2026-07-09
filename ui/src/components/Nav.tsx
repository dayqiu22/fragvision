import { Link as RouterLink, Outlet } from 'react-router';
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	Container,
} from '@mui/material';
import SearchModal from './SearchModal';

const titleStyle = {
	fontWeight: 800,
	letterSpacing: '-0.025em',
	textDecoration: 'none',
	background: 'linear-gradient(to right, #a855f7, #ec4899)',
	WebkitBackgroundClip: 'text',
	WebkitTextFillColor: 'transparent',
}

const discoverButtonStyle = {
	color: 'text.secondary',
	textTransform: 'none',
	fontSize: '1rem',
	'&:hover': { color: 'text.primary' }
}

const Nav = () => {
	return (
		<>
			<AppBar position="sticky" color="inherit" elevation={1} sx={{ backgroundColor: 'background.paper' }}>
				<Container maxWidth="xl">
					<Toolbar disableGutters sx={{ display: 'flex' }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexGrow: 3 }}>
							<Typography
								variant="h6"
								noWrap
								component={RouterLink}
								to="/"
								sx={titleStyle}
							>
								fRAGvision
							</Typography>
							<Button
								component={RouterLink}
								to="/"
								sx={discoverButtonStyle}
							>
								Discover
							</Button>

							<SearchModal />
						</Box>
					</Toolbar>
				</Container>
			</AppBar>

			<Box component="main" sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
				<Outlet />
			</Box>
		</>
	);
};

export default Nav;