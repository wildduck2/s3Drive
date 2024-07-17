export interface DataDriver {
  upload(id: string, data: string): string;
  retrive(id: string): string;
}
