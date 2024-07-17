import { DataDriver } from "./index.types";

class DataBase implements DataDriver {
  upload(id: string, data: string): string {
    //NOTE: will get he data from the db
  }
  retrive(id: string): string {
    //NOTE: will get he data from the db
  }
}
