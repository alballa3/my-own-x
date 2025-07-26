import { db } from "../server";

export function generateID(table: string) {
  const data = db[table];
  if (!data) {
    return 0;
  }
  return Object.keys(data).length + 1;
}

export function Store(table: string, data: Record<string, any>) {
  if (!table || !data) {
    throw Error("table or data is required");
  }
  if (!db[table]) {
    db[table] = {}; // Initialize the table if not present
  }
  return db[table][generateID(table)] = {
    ...data,
    created_at: Date.now(),
  };
}
// record is The unique data that i didnt want to make it there 
export function StoreUnique(table: string, record: string, data: Record<string, any>) {
  const allUser = FindAll(table)
  let array = Object.values(allUser || {})
  let check = array.find((e) => e[record] === data[record])
  if (check) {
    throw Error("The Email Exites Choose another one.")
  }
  return Store(table, data)
}
export function FindAll(table: string) {
  if (!table) {
    throw Error("table is required");
  }
  return db[table];
}
// first mean only Found One Or The First One 
export function FindBy(table: string, record: string, value: string, first: boolean) {
  if (!table || !record || !value) {
    throw Error("table, record, and value are required");
  }
  const allUser = FindAll(table)
  let array = Object.values(allUser || {})
  let check = first ? array.find((e) => e[record] === value) : array.filter((e) => e[record] === value)
  return check
}
export function Find(table: string, id: string) {
  if (!table || !id) {
    throw Error("table or id is required");
  }
  return db[table][id];
}

export function Update(table: string, id: string, data: Record<string, any>) {
  if (!table || !id || !data) {
    throw Error("table or id or data is required");
  }
  db[table][id] = {
    ...db[table][id],
    ...data,
    updated_at: Date.now(),
  };
}
export function Delete(table: string, id: string) {
  if (!table || !id) {
    throw Error("table or id is required");
  }
  delete db[table][id];
}
