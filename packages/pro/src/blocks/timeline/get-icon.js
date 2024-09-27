export default function SVGComponent({ icon }) {
  const { viewBox, xmlns, children } = icon.icon.props;
  const pathData = children.props.d;

  return (
    <svg
      className="ub-timeline-item-connector-icon"
      viewBox={viewBox}
      xmlns={xmlns}
    >
      <path d={pathData} />
    </svg>
  );
}
