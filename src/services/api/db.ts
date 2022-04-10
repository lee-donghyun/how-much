import Dexie, { Table } from "dexie";

export interface Record {
  id?: number;
  value: number;
  description: string;
  unix: number;
  type: "plus" | "minus";
}

class RecordDB extends Dexie {
  records!: Table<Record>;
  constructor() {
    super("howMuchDatabase");
    this.version(5).stores({
      records: "++id, unix, type",
    });
  }
}

export default new RecordDB();
