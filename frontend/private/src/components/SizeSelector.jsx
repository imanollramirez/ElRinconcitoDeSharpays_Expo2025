import React from 'react';

// Componente para seleccionar tallas de productos
// Permite seleccionar múltiples tallas y resaltar las seleccionadas
const sizesList = ["-","XS", "S", "M", "L", "XL", "XXL"];

const SizeSelector = ({ selectedSizes, setSelectedSizes }) => {
  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {sizesList.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => toggleSize(size)}
          className={`px-3 py-1 border rounded-md text-sm 
            ${selectedSizes.includes(size)
              ? "bg-black text-white border-black"
              : "bg-white text-black border-gray-400"}
            hover:shadow-sm transition`}
        >
          {size}
        </button>
      ))}
    </div>
  );
};

export default SizeSelector;
