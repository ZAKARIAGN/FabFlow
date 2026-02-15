import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";

const SearchableSelect = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "-- Sélectionner --",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filter options
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.type && option.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Limit to 5 if no search term
  const displayedOptions = searchTerm ? filteredOptions : filteredOptions.slice(0, 5);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={`relative z-10 ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 px-3 py-2 rounded bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:border-blue-500"
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
          {selectedOption 
            ? `${selectedOption.label} ${selectedOption.type ? `(${selectedOption.type})` : ''}` 
            : placeholder}
        </span>
        <ChevronDown 
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          size={16} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full z-[999] bg-white shadow-2xl border border-gray-200 rounded-lg mt-1">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search 
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" 
                size={14} 
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTerm("");
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto max-h-64">
            {displayedOptions.length > 0 ? (
              displayedOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors text-sm ${
                    option.value === value ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">{option.label}</span>
                    {option.type && (
                      <span className="text-xs text-gray-500">{option.type}</span>
                    )}
                  </div>
                  {option.prix !== undefined && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {Number(option.prix).toFixed(2)} DH
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                Aucun produit trouvé
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
