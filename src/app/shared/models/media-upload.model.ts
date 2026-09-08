export interface ImageUploadResult {
  readonly url: string;
}

export interface ImageUploadRequest {
  readonly file: File;
  readonly folder: 'categories' | 'dishes' | 'restaurant';
}
