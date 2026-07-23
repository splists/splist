export interface SplistOutput {
  filepath: string;
  data: string;
}

export interface SplistConfig {
  conflictMode: string;
  generateToc: boolean;
  customMarker: string | null;
  frontmatterMode: string;
  outDir: string | null;
  mode: string;
}

export interface FolderGroup {
  folderName: string;
  files: Array<{ name: string; data: string }>;
}

declare global {
  interface Window {
    VFS: Record<string, string>;
    SPLIST_OUTPUT: SplistOutput[];
    SplistAPI: {
      runSplist: (virtualFilename: string, config: SplistConfig) => Promise<void>;
    };
    JSZip: any;
    fsMock: any;
  }
}
