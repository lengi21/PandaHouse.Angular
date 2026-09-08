import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageUploadRequest, ImageUploadResult } from '../../../shared/models/media-upload.model';

export interface MediaStorageRepository {
  uploadImage(request: ImageUploadRequest): Observable<ImageUploadResult>;
}

export const MEDIA_STORAGE_REPOSITORY = new InjectionToken<MediaStorageRepository>('MEDIA_STORAGE_REPOSITORY');
