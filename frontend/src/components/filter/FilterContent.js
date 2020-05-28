import React from "react";
import FilterFields from "./FilterFields";

export default function FilterContent({
  className,
  type,
  possibleFilters,
  applyFilters,
  filtersExpanded,
  unexpandFilters
}) {
  return (
    <FilterFields
      type={type}
      className={className}
      possibleFilters={possibleFilters}
      applyFilters={applyFilters}
      filtersExpanded={filtersExpanded}
      unexpandFilters={unexpandFilters}
    />
  );
}
