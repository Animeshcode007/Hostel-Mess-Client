import React from "react";
import instructions from "../data/instructions.json";

const Instructions = () => {
  return (
    <ul className="space-y-4 list-decimal list-inside text-lg">
      {instructions.map((instruction, index) => (
        <li key={index}>{instruction}</li>
      ))}
    </ul>
  );
};

export default Instructions;
