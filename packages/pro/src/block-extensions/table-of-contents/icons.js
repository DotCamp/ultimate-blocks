export const oneColumnIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 110">
		{[...Array(6).keys()].map(a => (
			<rect width="110" height="10" x="0" y={a * 20} />
		))}
	</svg>
);

export const twoColumnsIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 110">
		{[...Array(6).keys()].map(a => (
			<>
				<rect width="50" height="10" x="0" y={a * 20} />
				<rect width="50" height="10" x="60" y={a * 20} />
			</>
		))}
	</svg>
);

export const threeColumnsIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 110">
		{[...Array(6).keys()].map(a => (
			<>
				<rect width="30" height="10" x="0" y={a * 20} />
				<rect width="30" height="10" x="40" y={a * 20} />
				<rect width="30" height="10" x="80" y={a * 20} />
			</>
		))}
	</svg>
);

export const plainList = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		height="20"
		width="20"
		viewBox="0 0 20 20"
	>
		<rect x="0" fill="none" width="20" height="20" />
		<path d="M4 5h13v1h-13v-1z M4 10h13v1h-13v-1z M4 15h13v1h-13v-1z" />
	</svg>
);
