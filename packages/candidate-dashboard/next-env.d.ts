/// <reference types="next" />
/// <reference types="next/types/global" />

declare namespace NodeJS {
  interface ProcessEnv {
    // backend host (https://$HOSTNAME:$PORT)
    readonly HOST: string;
  }
}
