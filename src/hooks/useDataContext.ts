import { useContext } from "react";
import { DataContext } from "../contexts/DataContext"; // Adjust the import path accordingly

export function useDataContext() {
  return useContext(DataContext);
}
