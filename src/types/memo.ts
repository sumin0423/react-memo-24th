export type Tag = "daily" | "work" | "others";
export type TagFilter = Tag | "all";
export type MemoDraft = { title: string; content: string; date: string; tag: Tag; isPinned: boolean };
export type Memo = MemoDraft & { id: number };
export type EditorMemo = Omit<MemoDraft, "tag"> & { id?: number; tag: Tag | "" };
