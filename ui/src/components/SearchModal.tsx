import { useState, useEffect, useRef } from 'react';
import {
	Button,
	Box,
	Modal,
	TextField,
	IconButton,
	InputAdornment,
	Typography
} from '@mui/material';
import { Link as RouterLink } from 'react-router';
import ClearIcon from '@mui/icons-material/Clear';
import { SEARCHES_API_ENDPOINT } from '../constants';
import type { Fragrance } from '../models/fragrance';
import type { FragranceSearchResults } from '../models/searchResults';

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
	borderColor: 'rgba(255, 255, 255, 0.23)',
	borderRadius: '50px',
	padding: '7.5px 14px',
	'&:hover': {
		borderColor: 'text.primary',
		backgroundColor: 'transparent',
	}
};

const modalContentStyle = {
	display: 'flex',
	flexDirection: 'column',
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 1000,
	maxWidth: '90vw',
	height: 550,
	maxHeight: '90vh',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

const searchInputRowStyle = {
	display: 'flex',
	alignItems: 'center',
	gap: '16px',
	width: '100%',
};

const searchResultsStyle = {
	display: 'flex',
	flexDirection: 'column',
	gap: '8px',
	mt: 2,
	flexGrow: 1,
	overflowY: 'auto',
};

const searchResultItemStyle = {
	display: 'flex',
	alignItems: 'center',
	gap: '12px',
	padding: '8px 12px',
	borderRadius: '4px',
	backgroundColor: 'rgba(255, 255, 255, 0.05)',
	textDecoration: 'none',
	color: '#fff',
	'&:hover': {
		backgroundColor: 'rgba(255, 255, 255, 0.12)',
		cursor: 'pointer',
		textDecoration: 'none',
	},
};

const SearchModal = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	}
	const [searchResults, setSearchResults] = useState<Fragrance[]>([]);
	const handleClear = () => {
		setSearchQuery('');
		setSearchResults([]);
	}
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
		handleClear();
	};
	const maxResults = 8;
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (open) {
			const timer = setTimeout(() => {
				inputRef.current?.focus();
			}, 50);
			return () => clearTimeout(timer);
		}
	}, [open]);

	useEffect(() => {
		if (!searchQuery.trim()) {
			setSearchResults([]);
			return;
		}

		const delayDebounceFn = setTimeout(() => {
			fetch(`${SEARCHES_API_ENDPOINT}?input_text=${encodeURIComponent(searchQuery)}`)
				.then(res => res.json() as Promise<FragranceSearchResults>)
				.then(data => {
					setSearchResults(data.fragrances);
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
					<Box sx={searchInputRowStyle}>
						<TextField
							inputRef={inputRef}
							fullWidth
							size="small"
							placeholder="Search fragrances by brand and name..."
							variant="outlined"
							value={searchQuery}
							onChange={handleSearchChange}
							autoComplete="off"
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

					{searchResults.length > 0 && (
						<Box sx={searchResultsStyle}>
							{searchResults.slice(0, maxResults).map((result) => (
								<Box
									key={result.id}
									sx={searchResultItemStyle}
									component={RouterLink}
									to={`/fragrances/${result.id}`}
									state={{ fragrance: result }}
									onClick={handleClose}
								>
									<Typography variant="body1" sx={{ fontStyle: 'italic', color: '#fff' }}>
										{result.brand}
									</Typography>
									<Typography variant="body1" sx={{ fontWeight: 700, color: '#fff' }}>
										{result.name}
									</Typography>
								</Box>
							))}
						</Box>
					)}
				</Box>
			</Modal>
		</Box>
	);
};

export default SearchModal;
