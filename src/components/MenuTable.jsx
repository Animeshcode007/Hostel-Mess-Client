import React from "react";
import menuData from "../data/menu.json";

const MenuTable = () => {
  const formatMenuItem = (itemString) => {
    if (!itemString.includes("(")) {
      return <span>{itemString}</span>;
    }
    const parts = itemString.split(" (");
    const english = parts[0];
    const hindi = `(${parts[1]}`;

    return (
      <>
        <span>{english}</span>
        <br />
        <span className="text-gray-300 text-xs">{hindi}</span>
      </>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm font-light text-white">
        <thead className="border-b font-medium border-white/30">
          <tr>
            <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">
              Day
            </th>
            <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">
              Lunch
            </th>
            <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">
              Dinner
            </th>
          </tr>
        </thead>
        <tbody>
          {menuData.map((item) => (
            <tr
              key={item.day}
              className="border-b border-white/20 transition-colors hover:bg-white/10"
            >
              <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4 font-medium">
                {formatMenuItem(item.day)}
              </td>
              <td className="px-4 py-3 sm:px-6 sm:py-4 leading-relaxed">
                {formatMenuItem(item.lunch)}
              </td>

              <td className="px-4 py-3 sm:px-6 sm:py-4 leading-relaxed">
                {formatMenuItem(item.dinner)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MenuTable;
