import { DataDriver } from "./index.types";

class S3 implements DataDriver {
  upload(id: string, data: string): string {
    //NOTE: will fech the data
  }
  retrive(id: string): string {
    //NOTE: will fech the data
  }
}
