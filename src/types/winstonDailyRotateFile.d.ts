declare module 'winston-daily-rotate-file' {
  import TransportStream, { TransportStreamOptions } from 'winston-transport';

  interface IDailyRotateFileOptions extends TransportStreamOptions {
    filename?: string;
    dirname?: string;
    datePattern?: string;
    zippedArchive?: boolean;
    stream?: TransportStream;
    maxSize?: string;
    maxFiles?: string;
  }

  class DailyRotateFile extends TransportStream {
    constructor(opts: IDailyRotateFileOptions);
  }

  export = DailyRotateFile;
}