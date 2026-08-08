import { useState } from 'react';
import { Link as RouterLink } from 'react-router';
import {
	Box,
	Typography,
	Paper,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Slider,
	Button,
	Chip,
	IconButton,
	CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SendIcon from '@mui/icons-material/Send';
import { RECOMMENDATIONS_API_ENDPOINT } from '../constants';
import type { Fragrance } from '../models/fragrance';

const pageContainerStyle = {
	maxWidth: 820,
	mx: 'auto',
	py: 5,
	px: 2,
};

const formCardStyle = {
	p: { xs: 3, sm: 4 },
	borderRadius: 3,
	display: 'flex',
	flexDirection: 'column',
	gap: 3.5,
};

const sectionTitleStyle = {
	fontWeight: 700,
	letterSpacing: 0.5,
	mb: 1,
};

const rowStyle = {
	display: 'grid',
	gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
	gap: 2.5,
};

const tagInputRowStyle = {
	display: 'flex',
	gap: 1,
	alignItems: 'flex-start',
};

const chipContainerStyle = {
	display: 'flex',
	flexWrap: 'wrap',
	gap: 0.75,
	mt: 1,
};

const numRecsBoxStyle = {
	display: 'flex',
	alignItems: 'center',
	gap: 1.5,
};

const resultCardStyle = {
	p: 2.5,
	borderRadius: 2,
	textDecoration: 'none',
	transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
	'&:hover': {
		transform: 'translateY(-3px)',
		boxShadow: 6,
	},
};

const ratingMarks = Array.from({ length: 11 }, (_, i) => ({
	value: i * 0.5,
	label: i % 2 === 0 ? `${i * 0.5}` : '',
}));

interface TagInputProps {
	label: string;
	tags: string[];
	onAdd: (tag: string) => void;
	onRemove: (index: number) => void;
	id: string;
}

const TagInput = ({ label, tags, onAdd, onRemove, id }: TagInputProps) => {
	const [value, setValue] = useState('');

	const handleAdd = () => {
		const trimmed = value.trim();
		if (trimmed && !tags.includes(trimmed)) {
			onAdd(trimmed);
			setValue('');
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleAdd();
		}
	};

	return (
		<Box>
			<Box sx={tagInputRowStyle}>
				<TextField
					id={id}
					label={label}
					size="small"
					fullWidth
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<IconButton
					onClick={handleAdd}
					color="primary"
					aria-label={`add ${label.toLowerCase()}`}
					sx={{ mt: 0.25 }}
				>
					<AddIcon />
				</IconButton>
			</Box>
			{tags.length > 0 && (
				<Box sx={chipContainerStyle}>
					{tags.map((tag, idx) => (
						<Chip
							key={tag}
							label={tag}
							size="small"
							onDelete={() => onRemove(idx)}
							color="primary"
							variant="outlined"
						/>
					))}
				</Box>
			)}
		</Box>
	);
};

const HomeRoute = () => {
	// Form state
	const [brand, setBrand] = useState('');
	const [gender, setGender] = useState<'male' | 'female' | 'unisex'>('unisex');
	const [lowerDecade, setLowerDecade] = useState('');
	const [upperDecade, setUpperDecade] = useState('');
	const [rating, setRating] = useState<number | null>(null);
	const [topNotes, setTopNotes] = useState<string[]>([]);
	const [middleNotes, setMiddleNotes] = useState<string[]>([]);
	const [baseNotes, setBaseNotes] = useState<string[]>([]);
	const [accords, setAccords] = useState<string[]>([]);
	const [numRecommendations, setNumRecommendations] = useState(5);

	// Results state
	const [results, setResults] = useState<Fragrance[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasSearched, setHasSearched] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		setHasSearched(true);

		const body = {
			brand: brand.trim() || null,
			gender,
			lower_decade: lowerDecade ? parseInt(lowerDecade, 10) : null,
			upper_decade: upperDecade ? parseInt(upperDecade, 10) : null,
			rating: rating,
			top_notes: topNotes.length > 0 ? topNotes : null,
			middle_notes: middleNotes.length > 0 ? middleNotes : null,
			base_notes: baseNotes.length > 0 ? baseNotes : null,
			accords,
			num_recommendations: numRecommendations,
		};

		try {
			const res = await fetch(RECOMMENDATIONS_API_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			});

			if (!res.ok) {
				throw new Error(`Request failed with status ${res.status}`);
			}

			const data = await res.json();
			setResults(data.fragrances || []);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Something went wrong');
			setResults([]);
		} finally {
			setIsLoading(false);
		}
	};

	const removeFromList = (list: string[], idx: number) =>
		list.filter((_, i) => i !== idx);

	return (
		<Box sx={pageContainerStyle}>
			<Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 4 }}>
				Find Your Fragrance
			</Typography>

			<Paper elevation={3} sx={formCardStyle} component="form" onSubmit={handleSubmit}>
				{/* ── Brand & Gender ── */}
				<Box sx={rowStyle}>
					<TextField
						id="brand-input"
						label="Brand"
						placeholder="e.g. Dior, Chanel"
						fullWidth
						value={brand}
						onChange={(e) => setBrand(e.target.value)}
					/>
					<FormControl fullWidth>
						<InputLabel id="gender-label">Gender</InputLabel>
						<Select
							labelId="gender-label"
							id="gender-select"
							value={gender}
							label="Gender"
							onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'unisex')}
						>
							<MenuItem value="male">Male</MenuItem>
							<MenuItem value="female">Female</MenuItem>
							<MenuItem value="unisex">Unisex</MenuItem>
						</Select>
					</FormControl>
				</Box>

				{/* ── Decade Range ── */}
				<Box sx={rowStyle}>
					<TextField
						id="lower-decade-input"
						label="Lower Decade"
						placeholder="e.g. 1990"
						type="number"
						fullWidth
						value={lowerDecade}
						onChange={(e) => setLowerDecade(e.target.value)}
					/>
					<TextField
						id="upper-decade-input"
						label="Upper Decade"
						placeholder="e.g. 2020"
						type="number"
						fullWidth
						value={upperDecade}
						onChange={(e) => setUpperDecade(e.target.value)}
					/>
				</Box>

				{/* ── Rating ── */}
				<Box>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
						Minimum Rating: {rating !== null ? `${rating} / 5` : 'Any'}
					</Typography>
					<Slider
						id="rating-slider"
						value={rating ?? 0}
						min={0}
						max={5}
						step={0.5}
						marks={ratingMarks}
						valueLabelDisplay="auto"
						onChange={(_, val) => setRating(val as number === 0 ? null : val as number)}
						sx={{ mx: 1, width: 'calc(100% - 16px)' }}
					/>
				</Box>

				{/* ── Notes ── */}
				<Box>
					<Typography variant="subtitle1" sx={sectionTitleStyle}>
						Notes
					</Typography>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						<TagInput
							id="top-notes-input"
							label="Top Notes"
							tags={topNotes}
							onAdd={(t) => setTopNotes([...topNotes, t])}
							onRemove={(i) => setTopNotes(removeFromList(topNotes, i))}
						/>
						<TagInput
							id="middle-notes-input"
							label="Middle Notes"
							tags={middleNotes}
							onAdd={(t) => setMiddleNotes([...middleNotes, t])}
							onRemove={(i) => setMiddleNotes(removeFromList(middleNotes, i))}
						/>
						<TagInput
							id="base-notes-input"
							label="Base Notes"
							tags={baseNotes}
							onAdd={(t) => setBaseNotes([...baseNotes, t])}
							onRemove={(i) => setBaseNotes(removeFromList(baseNotes, i))}
						/>
					</Box>
				</Box>

				{/* ── Accords ── */}
				<Box>
					<Typography variant="subtitle1" sx={sectionTitleStyle}>
						Accords
					</Typography>
					<TagInput
						id="accords-input"
						label="Accords"
						tags={accords}
						onAdd={(t) => setAccords([...accords, t])}
						onRemove={(i) => setAccords(removeFromList(accords, i))}
					/>
				</Box>

				{/* ── Num Recommendations ── */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						flexWrap: 'wrap',
						gap: 2,
					}}
				>
					<Box sx={numRecsBoxStyle}>
						<Typography variant="body2" color="text.secondary">
							Results:
						</Typography>
						<IconButton
							onClick={() => setNumRecommendations((p) => Math.max(1, p - 1))}
							disabled={numRecommendations <= 1}
							size="small"
							aria-label="decrease recommendations"
						>
							<RemoveIcon fontSize="small" />
						</IconButton>
						<Typography variant="body1" sx={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>
							{numRecommendations}
						</Typography>
						<IconButton
							onClick={() => setNumRecommendations((p) => Math.min(20, p + 1))}
							disabled={numRecommendations >= 20}
							size="small"
							aria-label="increase recommendations"
						>
							<AddIcon fontSize="small" />
						</IconButton>
					</Box>

					<Button
						type="submit"
						variant="contained"
						size="large"
						endIcon={<SendIcon />}
						disabled={isLoading}
						sx={{
							px: 4,
							py: 1.25,
							fontWeight: 600,
							borderRadius: 2,
							textTransform: 'none',
							fontSize: '1rem',
						}}
					>
						{isLoading ? 'Searching…' : 'Get Recommendations'}
					</Button>
				</Box>
			</Paper>

			{/* ── Results ── */}
			{isLoading && (
				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
					<CircularProgress />
				</Box>
			)}

			{error && (
				<Typography color="error" sx={{ mt: 3, textAlign: 'center' }}>
					{error}
				</Typography>
			)}

			{!isLoading && hasSearched && results.length === 0 && !error && (
				<Typography
					variant="body1"
					sx={{ mt: 4, textAlign: 'center', color: 'text.secondary', fontStyle: 'italic' }}
				>
					No recommendations found. Try adjusting your criteria.
				</Typography>
			)}

			{results.length > 0 && (
				<Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
					<Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
						Recommendations
					</Typography>
					{results.map((frag) => (
						<Paper
							key={frag.id}
							component={RouterLink}
							to={`/fragrances/${frag.id}`}
							state={{ fragrance: frag }}
							elevation={2}
							sx={resultCardStyle}
						>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 1 }}>
								<Box>
									<Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
										{frag.brand}
									</Typography>
									<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
										{frag.name}
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', gap: 3 }}>
									{frag.rating != null && (
										<Typography variant="body2" color="text.secondary">
											★ {frag.rating}
										</Typography>
									)}
									{frag.decade != null && (
										<Typography variant="body2" color="text.secondary">
											{frag.decade}s
										</Typography>
									)}
									<Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
										{frag.gender}
									</Typography>
								</Box>
							</Box>
						</Paper>
					))}
				</Box>
			)}
		</Box>
	);
};

export default HomeRoute;