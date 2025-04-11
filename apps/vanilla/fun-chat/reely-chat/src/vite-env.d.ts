/// <reference types="vite/client" />
interface ImportMetaEnvironment {
  readonly VITE_MIK_API_URL: string;
  // readonly VITE_ASSETS_URL: string;
  // more env variables here...
}

interface ImportMeta {
  readonly env: ImportMetaEnvironment;
}
