"use client";

import React from "react";
import Select from "react-select";

interface Option {
  value: string;
  label: string;
}

interface TagSelectProps {
  options: Option[];
  value: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
}

const TagSelect: React.FC<TagSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <Select
      isMulti
      options={options}
      value={value}
      onChange={(selected) => onChange(selected as Option[])}
      placeholder={placeholder}
      closeMenuOnSelect={false}
      isSearchable
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      styles={{
        control: (provided) => ({
          ...provided,
          minHeight: "40px",
          borderRadius: "6px",
        }),
        multiValue: (provided) => ({
          ...provided,
          backgroundColor: "#e2e8f0",
        }),
        multiValueLabel: (provided) => ({
          ...provided,
          color: "#1a202c",
        }),
        multiValueRemove: (provided) => ({
          ...provided,
          color: "#1a202c",
          ":hover": {
            backgroundColor: "#cbd5e0",
            color: "#1a202c",
          },
        }),
      }}
    />
  );
};

export default TagSelect;
