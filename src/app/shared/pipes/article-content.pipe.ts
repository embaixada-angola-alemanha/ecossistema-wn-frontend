import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'articleContent', standalone: true })
export class ArticleContentPipe implements PipeTransform {

  transform(html: string | null | undefined): string {
    if (!html) return '';

    let clean = html;

    // 1. Strip Divi shortcodes: [et_pb_*] and [/et_pb_*]
    clean = clean.replace(/\[\/?et_pb_[^\]]*\]/g, '');

    // 2. Remove empty <a></a> tags
    clean = clean.replace(/<a[^>]*>\s*<\/a>/gi, '');

    // 3. Remove empty <figure> blocks (empty embeds)
    clean = clean.replace(/<figure[^>]*>\s*<\/figure>/gi, '');

    // 4. Remove empty <p> tags (including whitespace-only)
    clean = clean.replace(/<p[^>]*>(\s|&nbsp;)*<\/p>/gi, '');

    // 5. Collapse multiple consecutive <br> tags into one
    clean = clean.replace(/(<br\s*\/?>[\s]*){2,}/gi, '<br/>');

    // 6. Strip srcset attributes (old WordPress domain)
    clean = clean.replace(/\s*srcset="[^"]*"/gi, '');

    // 7. Strip sizes attribute (not needed without srcset)
    clean = clean.replace(/\s*sizes="[^"]*"/gi, '');

    // 8. Trim leading/trailing whitespace
    clean = clean.trim();

    return clean;
  }
}
