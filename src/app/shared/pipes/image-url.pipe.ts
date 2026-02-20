import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@env/environment';

@Pipe({ name: 'imageUrl', standalone: true })
export class ImageUrlPipe implements PipeTransform {
  transform(imageId: string | undefined | null): string | null {
    return imageId ? `${environment.apiBaseUrl}/media/${imageId}` : null;
  }
}
