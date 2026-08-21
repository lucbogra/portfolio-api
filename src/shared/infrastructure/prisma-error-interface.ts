export interface PrismaError {
    code?: string;
    meta?: {
      driverAdapterError?: {
        cause?: {
          kind?: string;
          constraint?: {
            fields?: string[];
            index?: string;
          };
        };
      };
    };
}