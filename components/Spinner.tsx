export function Spinner(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg width={132} height={32} viewBox="0 0 32 32" {...props}>
			<g strokeWidth={2} fill="none" fillRule="evenodd">
				<circle strokeOpacity={0.25} cx={8} cy={8} r={7} stroke="currentColor" />
				<path strokeLinecap="round" d="M15 8c0-4.5-4.5-7-7-7" stroke="currentColor">
					<animateTransform
						attributeName="transform"
						type="rotate"
						from="0 8 8"
						to="360 8 8"
						dur="1s"
						repeatCount="indefinite"
					/>
				</path>
			</g>
		</svg>
	)
}
