import { Link as RouterLink, Outlet } from 'react-router';
import { AppBar, Toolbar, Typography, Button, Box, TextField, Container } from '@mui/material';

const Nav = () => {
	return (
		<>
			<AppBar position="sticky" color="inherit" elevation={1} sx={{ backgroundColor: 'background.paper' }}>
				<Container maxWidth="xl">
					<Toolbar disableGutters sx={{ display: 'flex' }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexGrow: 1 }}>
							<Typography
								variant="h6"
								noWrap
								component={RouterLink}
								to="/"
								sx={{
									fontWeight: 800,
									letterSpacing: '-0.025em',
									textDecoration: 'none',
									background: 'linear-gradient(to right, #a855f7, #ec4899)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
								}}
							>
								fRAGvision
							</Typography>
							<Button
								component={RouterLink}
								to="/"
								sx={{ color: 'text.secondary', textTransform: 'none', fontSize: '1rem', '&:hover': { color: 'text.primary' } }}
							>
								Discover
							</Button>

							<Box sx={{ width: '100%', maxWidth: 400, ml: 1 }}>
								<TextField
									fullWidth
									size="small"
									placeholder="Search fragrances by brand and name..."
									variant="outlined"
									sx={{
										'& .MuiOutlinedInput-root': {
											borderRadius: '50px',
										}
									}}
								/>
							</Box>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>

			<Box component="main" sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
				<Outlet />
			</Box>
		</>
	);
};

export default Nav;