import type { StateInfo } from "../data/indiaStates";

type Props = {
  states: StateInfo[];
  onSelect: (state: StateInfo) => void;
};

export default function StatePanel({ states, onSelect }: Props) {
  return (
    <div
      style={{
        width: "220px",
        padding: "12px",
        borderLeft: "1px solid #ddd",
        background: "#fff",
        overflowY: "auto",
      }}
    >
      <h3>States</h3>
      {states.map((state) => (
        <div
          key={state.name}
          onClick={() => onSelect(state)}
          style={{
            padding: "8px",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
          }}
        >
          {state.name}
        </div>
      ))}
    </div>
  );
}
