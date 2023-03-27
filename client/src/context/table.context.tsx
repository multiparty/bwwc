import { createContext, useState } from 'react';

interface TableContextType {
  table: Record<string, any>;
  setTable: (newTable: Record<string, any>) => void;
}

export const TableContext = createContext<TableContextType>({
  table: {},
  setTable: () => {},
});

interface TableContextProviderProps {
  value: TableContextType;
  children: React.ReactNode;
}

const TableContextProvider: React.FC<TableContextProviderProps> = ({ value, children }) => {
  const [table, setTable] = useState(value.table);

  return (
    <TableContext.Provider value={{ table, setTable }}>
      {children}
    </TableContext.Provider>
  );
};

export default TableContextProvider;
