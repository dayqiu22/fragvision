import { useLocation, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { FRAGRANCES_API_ENDPOINT } from '../constants';

const Fragrance = () => {
	const { id } = useParams();
	const location = useLocation();
	const [fragranceData, setFragranceData] = useState(location.state?.fragrance || null);

	useEffect(() => {
		// Fallback: If page was directly visited or refreshed, fetch from API
		if (!fragranceData && id) {
			fetch(`${FRAGRANCES_API_ENDPOINT}/${id}`)
				.then((res) => res.json())
				.then((data) => setFragranceData(data))
				.catch((err) => console.error(err));
		}
	}, [id, fragranceData]);
	if (!fragranceData) return <div>Loading...</div>

	return (
		<div>
			<h1>{fragranceData.brand} {fragranceData.name}</h1>
		</div>
	)
}

export default Fragrance