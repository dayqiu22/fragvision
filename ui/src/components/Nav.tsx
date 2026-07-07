import { Link, Outlet } from 'react-router'

const Nav = () => {
	return (
		<nav>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/fragrance/:id">Fragrance</Link>
				</li>
			</ul>
			<Outlet />
		</nav>
	)
}

export default Nav