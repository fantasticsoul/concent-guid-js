import React from "react";

export default ({ title = "", value, onChange }) => (
  <div className="field">
    <div className="control is-small">
      {title}
      <input
        value={value}
        onChange={onChange}
        className="input is-primary is-small"
      />
    </div>
  </div>
);
