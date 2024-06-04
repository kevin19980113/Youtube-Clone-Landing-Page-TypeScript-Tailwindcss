import { ReactNode, createContext, useContext, useState } from "react";

type SidebarProviderProps = {
  children: ReactNode;
};

type SidebarContextType = {
  isSidebarOpen: boolean;
  toggle: () => void;
  close: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebarContext() {
  const value = useContext(SidebarContext);
  if (value == null) throw Error("Cannot use outside of SidebarProvider");

  return value;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function toggle() {
    setIsSidebarOpen((o) => !o);
  }

  function close() {
    setIsSidebarOpen(false);
  }

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
}
