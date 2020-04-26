export interface Bridge {
  setImage: (options: { image: string }) => void;
  setTitle: (options: { title: string }) => void;
  setState: (options: { state: number }) => void;
}
