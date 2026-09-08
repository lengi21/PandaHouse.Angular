import { Service } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { ImageUploadRequest, ImageUploadResult } from '../../../shared/models/media-upload.model';
import { MediaStorageRepository } from './media-storage.repository';

/** Replaced by the Supabase storage repository after project credentials are configured. */
@Service()
export class MockMediaStorageRepository implements MediaStorageRepository {
  uploadImage(request: ImageUploadRequest): Observable<ImageUploadResult> {
    return of({ url: URL.createObjectURL(request.file) }).pipe(delay(450));
  }
}
