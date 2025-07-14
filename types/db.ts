export interface RecordDB {
  // Here The Table Name
  [tableName: string]: {
    // Here The ID
    [id: string]: {
      // Here The Value
      [data: string]: any;
      // Here The Create Time
      created_at: number;
    };
  };
}
