export interface User {
  displayName?: string;
  preferedCharacter?: string;
  id?: string;
}
export interface Comments {
  text?: string;
  evidence?: { path: string; alt?: string; title?: string };
  user: User;
}

// 256 * 192
export interface EngineJob {
  forceCodec?: { codec: string; extension: string };
  tmpDir: string;
  comments: Comments[];
}
