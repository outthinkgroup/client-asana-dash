import styled from "styled-components";
const statuses = {
  green: "On Track",
  yellow: "At Risk",
  red: "Off Track",
};

export default function StatusBadge({ color }) {
  const status = statuses[color];
  return (
    <StatusBadgeWrapper color={color}>
      <span className="bg"></span>
      <div className="status-dot"></div>
      <span>{status}</span>
    </StatusBadgeWrapper>
  );
}

const StatusBadgeWrapper = styled.div`
  --statusColor: var(--asana-${({ color }) => color});
  position: relative;
	background-color:white;
  .bg {
    position: absolute;
    inset: 0;
    background-color: var(--statusColor);
    opacity: 0.12;
  }
  .status-dot {
    background-color: var(--statusColor);
    width: 0.5em;
    height: 0.5em;
    border-radius: 50%;
  }
  border: 1px solid var(--statusColor);
  color: var(--statusColor);
  padding: 0.33em 0.5em;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5em;
  border-radius: 0.25em;

  font-weight: 600;
  font-size: 12px;
`;
