import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../http/api-endpoints';
import { ImageUploadRequest, ImageUploadResult } from '../../../shared/models/media-upload.model';
import { MediaStorageRepository } from './media-storage.repository';

@Service()
export class HttpMediaStorageRepository implements MediaStorageRepository {
  private readonly http = inject(HttpClient);

  uploadImage(request: ImageUploadRequest): Observable<ImageUploadResult> {
    const formData = new FormData();
    formData.set('file', request.file);
    formData.set('folder', request.folder);
    return this.http.post<ImageUploadResult>(apiUrl('/api/admin/media/images'), formData);
  }
}
