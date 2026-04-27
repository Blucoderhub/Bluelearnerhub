// Stub pool for legacy code
export const pool = {
  query: async (sql: string, params?: any[]) => ({ rows: [], rowCount: 0 }),
  end: async () => {},
};

export default pool;