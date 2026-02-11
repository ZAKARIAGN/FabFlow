import React from "react";

const ErrMsg = ({ msg }) => {
  if (msg) {
    return (
      <p className="bg-red-700/20 text-red-700 px-4 py-2 rounded-sm text-sm">{msg}</p>
    );
  }
};

export default ErrMsg;
