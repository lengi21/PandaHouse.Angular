import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable, defer, map, switchMap } from 'rxjs';
import { ImageUploadRequest, ImageUploadResult } from '../../../shared/models/media-upload.model';
import { MediaStorageRepository } from './media-storage.repository';

export interface SupabaseStorageConfig {
  readonly url: string;
  readonly anonKey: string;
  readonly bucket: string;
}

export const SUPABASE_STORAGE_CONFIG = new InjectionToken<SupabaseStorageConfig>('SUPABASE_STORAGE_CONFIG');

/** Direct Supabase Storage implementation. Activate it once the public bucket credentials are configured. */
@Injectable()
export class SupabaseStorageRepository implements MediaStorageRepository {
  constructor(@Inject(SUPABASE_STORAGE_CONFIG) private readonly config: SupabaseStorageConfig) {}

  uploadImage(request: ImageUploadRequest): Observable<ImageUploadResult> {
    const extension = request.file.name.split('.').at(-1)?.toLowerCase() || 'jpg';
    const objectPath = `${request.folder}/${crypto.randomUUID()}.${extension}`;
    const objectUrl = `${this.config.url}/storage/v1/object/${this.config.bucket}/${objectPath}`;
    return defer(() => fetch(objectUrl, {
      method: 'POST',
      headers: { apikey: this.config.anonKey, Authorization: `Bearer ${this.config.anonKey}`, 'Content-Type': request.file.type || 'image/jpeg', 'x-upsert': 'false' },
      body: request.file,
    })).pipe(
      switchMap((response) => response.ok ? [response] : Promise.reject(new Error('Supabase Storage upload failed.'))),
      map(() => ({ url: `${this.config.url}/storage/v1/object/public/${this.config.bucket}/${objectPath}` })),
    );
  }
}
