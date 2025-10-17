// src/hooks/useSearch.ts
import { useState, useMemo, ChangeEvent } from "react";

export type Searchable = Record<string, any>;

const useSearch = <T extends Searchable>(
  data: T[] = [], // default to empty array
  searchKeys: (keyof T)[]
) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data ?? [];

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return (data ?? []).filter((item) =>
      searchKeys.some((key) =>
        String(item[key] ?? "")
          .toLowerCase()
          .includes(lowerCaseSearchTerm)
      )
    );
  }, [data, searchTerm, searchKeys]);

  return { searchTerm, handleSearchChange, filteredData };
};

export default useSearch;
