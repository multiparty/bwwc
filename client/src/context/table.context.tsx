import { createContext, useState } from 'react';

interface TableContextType {
  table: Record<string, any>;
  setTable: (newTable: Record<string, any>) => void;
}

export const TableContext = createContext<TableContextType | undefined>(undefined);

interface TableContextProviderProps {
  children: React.ReactNode;
}

const TableContextProvider: React.FC<TableContextProviderProps> = ({ children }) => {
  const [table, setTable] = useState<Record<string, any>>({});

  return (
    <TableContext.Provider value={{ table, setTable }}>
      {children}
    </TableContext.Provider>
  );
};

export default TableContextProvider;
