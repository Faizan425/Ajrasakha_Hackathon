import { useState } from "react";
import type { StateInfo } from "../data/indiaStates";

type Props = {
  states: StateInfo[];
  onSelect: (state: StateInfo) => void;
  activeStateName: string | null;
};

export default function StatePanel({ states, onSelect, activeStateName }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStates = states.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="state-panel">
      <div className="state-panel-header">
        <h3>States ({states.length})</h3>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search states..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="state-list">
        {filteredStates.map((state) => (
          <div
            key={state.name}
            onClick={() => {
              onSelect(state);
            }}
            className={`state-item ${activeStateName === state.name ? "active" : ""}`}
          >
            {state.name}
          </div>
        ))}
        {filteredStates.length === 0 && (
          <p className="no-results">No states found.</p>
        )}
      </div>
    </div>
  );
}
