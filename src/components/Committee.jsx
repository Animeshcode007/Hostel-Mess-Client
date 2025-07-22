import React from "react";
import committeeMembers from "../data/committee.json";

const Committee = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      {committeeMembers.map((member, index) => (
        <div key={index} className="flex flex-col items-center text-center">
          <img
            src={member.imageUrl}
            alt={member.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white/50 shadow-lg mb-4"
          />
          <h3 className="text-lg sm:text-xl font-semibold">{member.name}</h3>
          <p className="text-gray-200">{member.role}</p>
        </div>
      ))}
    </div>
  );
};

export default Committee;
