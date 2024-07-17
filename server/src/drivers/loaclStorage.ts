import { DataDriver } from "./index.types";

class LocalStorage implements DataDriver {
  upload(id: string, data: string): string {
    //NOTE: will store the data on the system
    return data;
  }
  retrive(id: string): string {
    //NOTE: will store the data on the system
    return id;
  }
}
