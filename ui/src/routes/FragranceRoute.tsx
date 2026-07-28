import { useLocation, useParams, Link as RouterLink } from 'react-router';
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Link, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { FRAGRANCES_API_ENDPOINT, SEARCHES_API_ENDPOINT } from '../constants';
import type { Fragrance } from '../models/fragrance';
import type { FragranceSearchResults } from '../models/searchResults';

const brandStyle = {
	fontStyle: 'italic',
	fontWeight: 300,
	mr: 1.5,
};

const containerGridStyle = {
	display: 'grid',
	gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
	gap: 4,
	alignItems: 'start',
};

const detailsCardStyle = {
	p: 3,
	display: 'flex',
	flexDirection: 'column',
	gap: 2.5,
	borderRadius: 2,
};

const fieldLabelStyle = {
	textTransform: 'uppercase',
	letterSpacing: 1,
	display: 'block',
	mb: 0.5,
};

const descriptionCardStyle = {
	p: 3,
	borderRadius: 2,
};

const descriptionLabelStyle = {
	textTransform: 'uppercase',
	letterSpacing: 1,
	display: 'block',
	mb: 1,
};

const descriptionTextStyle = {
	lineHeight: 1.7,
	color: 'text.primary',
};

const similarSectionHeaderStyle = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	mt: 5,
	mb: 2,
};

const incrementerBoxStyle = {
	display: 'flex',
	alignItems: 'center',
	gap: 1,
};

const carouselContainerStyle = {
	display: 'flex',
	gap: 2,
	overflowX: 'auto',
	pb: 2,
	pt: 0.5,
	'&::-webkit-scrollbar': {
		height: 8,
	},
	'&::-webkit-scrollbar-thumb': {
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		borderRadius: 4,
	},
};

const similarCardStyle = {
	minWidth: 220,
	maxWidth: 260,
	flexShrink: 0,
	p: 2.5,
	borderRadius: 2,
	textDecoration: 'none',
	display: 'flex',
	flexDirection: 'column',
	gap: 1,
	transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
	'&:hover': {
		transform: 'translateY(-3px)',
		boxShadow: 6,
	},
};

const attributionStyle = {
	mt: 4,
	color: 'text.secondary',
};

const FragranceRoute = () => {
	const { id } = useParams();
	const location = useLocation();
	const [fragranceData, setFragranceData] = useState<Fragrance | null>(location.state?.fragrance || null);
	const [similarFragrances, setSimilarFragrances] = useState<Fragrance[]>([]);
	const [isSimilarLoading, setIsSimilarLoading] = useState<boolean>(true);
	const maxLimit = 12;
	const defaultLimit = 8;
	const [limit, setLimit] = useState<number>(defaultLimit);
	const incrementLimit = () => setLimit((prev) => Math.min(prev + 1, maxLimit));
	const decrementLimit = () => setLimit((prev) => Math.max(1, prev - 1));

	useEffect(() => {
		if (location.state?.fragrance) {
			setFragranceData(location.state.fragrance);
		} else if (id) {
			fetch(`${FRAGRANCES_API_ENDPOINT}/${id}`)
				.then((res) => res.json() as Promise<Fragrance>)
				.then((data) => setFragranceData(data))
				.catch((err) => console.error(err));
		}
	}, [id, location.state]);

	useEffect(() => {
		if (!id) return;
		setIsSimilarLoading(true);
		setSimilarFragrances([]);
		setLimit(defaultLimit);
		fetch(`${SEARCHES_API_ENDPOINT}/${id}?limit=${maxLimit}`)
			.then((res) => res.json() as Promise<FragranceSearchResults>)
			.then((data) => {
				setSimilarFragrances(data.fragrances || []);
				setIsSimilarLoading(false);
			})
			.catch((err) => {
				console.error(err);
				setIsSimilarLoading(false);
			});

		return () => {
			setSimilarFragrances([]);
			setIsSimilarLoading(true);
		};
	}, [id]);

	if (!fragranceData) return <Typography sx={{ p: 4 }}>Loading Fragrance Data...</Typography>;

	return (
		<Box sx={{ py: 4, px: 2 }}>
			<Typography variant="h4" component="h1" sx={{ mb: 4 }}>
				<Box component="span" sx={brandStyle}>
					{fragranceData.brand}
				</Box>
				<Box component="span" sx={{ fontWeight: 700 }}>
					{fragranceData.name}
				</Box>
			</Typography>

			<Box sx={containerGridStyle}>
				<Paper elevation={2} sx={detailsCardStyle}>
					<Box>
						<Typography variant="caption" color="text.secondary" sx={fieldLabelStyle}>
							Gender
						</Typography>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							{fragranceData.gender ? fragranceData.gender.toUpperCase() : 'UNISEX'}
						</Typography>
					</Box>

					<Box>
						<Typography variant="caption" color="text.secondary" sx={fieldLabelStyle}>
							Decade
						</Typography>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							{fragranceData.decade ? `${fragranceData.decade}s` : 'N/A'}
						</Typography>
					</Box>

					<Box>
						<Typography variant="caption" color="text.secondary" sx={fieldLabelStyle}>
							Rating
						</Typography>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							{fragranceData.rating != null ? `${fragranceData.rating} / 5` : 'N/A'}
						</Typography>
					</Box>
				</Paper>

				<Paper elevation={2} sx={descriptionCardStyle}>
					<Typography variant="caption" color="text.secondary" sx={descriptionLabelStyle}>
						Description
					</Typography>
					<Typography variant="body1" sx={descriptionTextStyle}>
						{fragranceData.description || 'No description available.'}
					</Typography>
				</Paper>
			</Box>

			<Box sx={similarSectionHeaderStyle}>
				<Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
					Similar Fragrances
				</Typography>
				<Box sx={incrementerBoxStyle}>
					<Typography variant="body2" color="text.secondary">
						Display count:
					</Typography>
					<IconButton onClick={decrementLimit} disabled={limit <= 1} size="small" aria-label="decrease limit">
						<RemoveIcon fontSize="small" />
					</IconButton>
					<Typography variant="body1" sx={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>
						{limit}
					</Typography>
					<IconButton onClick={incrementLimit} disabled={limit >= maxLimit} size="small" aria-label="increase limit">
						<AddIcon fontSize="small" />
					</IconButton>
				</Box>
			</Box>

			<Box sx={carouselContainerStyle}>
				{isSimilarLoading ? (
					<Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic', py: 2 }}>
						Loading similar fragrances...
					</Typography>
				) : similarFragrances.length === 0 ? (
					<Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic', py: 2 }}>
						No similar fragrances found.
					</Typography>
				) : (
					similarFragrances.slice(0, limit).map((frag) => (
						<Paper
							key={frag.id}
							component={RouterLink}
							to={`/fragrances/${frag.id}`}
							state={{ fragrance: frag }}
							elevation={2}
							sx={similarCardStyle}
						>
							<Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
								{frag.brand}
							</Typography>
							<Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
								{frag.name}
							</Typography>
						</Paper>
					))
				)}
			</Box>

			{fragranceData.url && (
				<Typography variant="body2" sx={attributionStyle}>
					Data was derived from Fragrantica:{' '}
					<Link href={fragranceData.url} target="_blank" rel="noopener noreferrer" underline="hover">
						{fragranceData.url}
					</Link>
				</Typography>
			)}
		</Box>
	);
};

export default FragranceRoute;