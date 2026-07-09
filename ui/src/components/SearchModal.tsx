import { useState, useEffect } from 'react';
import { Button, Box, Modal, TextField, IconButton, InputAdornment } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { SEARCHES_API_ENDPOINT } from '../constants';

const cancelButtonStyle = {
	color: 'text.secondary',
	textTransform: 'none',
	fontSize: '1rem',
	'&:hover': { color: 'text.primary' }
};

const searchButtonStyle = {
	width: '100%',
	justifyContent: 'flex-start',
	color: 'text.secondary',
	textTransform: 'none',
	fontSize: '0.875rem',
	border: '1px solid',
	borderColor: 'rgba(255, 255, 255, 0.23)', // default MUI outlined input border
	borderRadius: '50px',
	padding: '7.5px 14px', // matching size="small" input padding
	'&:hover': {
		borderColor: 'text.primary',
		backgroundColor: 'transparent',
	}
};

const modalContentStyle = {
	display: 'flex',
	alignItems: 'flex-start',
	gap: '16px',
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 1000,
	maxWidth: '90vw',
	height: 500,
	maxHeight: '90vh',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

const SearchModal = () => {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [searchQuery, setSearchQuery] = useState('');
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
		console.log(event.target.value);
	}
	const handleClear = () => {
		setSearchQuery('');
	}

	useEffect(() => {
		if (!searchQuery.trim()) return;

		const delayDebounceFn = setTimeout(() => {
			fetch(`${SEARCHES_API_ENDPOINT}?input_text=${encodeURIComponent(searchQuery)}`)
				.then(res => res.json())
				.then(data => {
					console.log('Search results:', data);
				})
				.catch(err => console.error('Error fetching search results:', err));
		}, 400);

		return () => clearTimeout(delayDebounceFn);
	}, [searchQuery]);

	return (
		<Box sx={{ width: '100%', maxWidth: 400 }}>
			<Button
				onClick={handleOpen}
				disableRipple
				sx={searchButtonStyle}
			>
				Search fragrances by brand and name...
			</Button>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={modalContentStyle}>
					<TextField
						autoFocus
						fullWidth
						size="small"
						placeholder="Search fragrances by brand and name..."
						variant="outlined"
						value={searchQuery}
						onChange={handleSearchChange}
						sx={{
							flexGrow: 1,
							'& .MuiOutlinedInput-root': {
								borderRadius: '50px',
							}
						}}
						slotProps={{
							input: {
								endAdornment: searchQuery ? (
									<InputAdornment position="end">
										<IconButton onClick={handleClear} edge="end">
											<ClearIcon />
										</IconButton>
									</InputAdornment>
								) : null,
							},
						}}
					/>
					<Button
						onClick={handleClose}
						sx={cancelButtonStyle}
					>
						Cancel
					</Button>
				</Box>
			</Modal>
		</Box>
	);
};

export default SearchModal;
