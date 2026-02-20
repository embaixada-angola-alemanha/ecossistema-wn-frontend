import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { inject } from '@angular/core';

@Pipe({ name: 'articleContent', standalone: true })
export class ArticleContentPipe implements PipeTransform {

  private readonly sanitizer = inject(DomSanitizer);

  transform(html: string | null | undefined, debug = false): SafeHtml | string {
    if (!html) return '';

    let clean = html;

    // 1. Strip Divi shortcodes
    clean = clean.replace(/\[\/?et_pb_[^\]]*\]/g, '');

    // 2. Remove empty <a></a> tags
    clean = clean.replace(/<a[^>]*>\s*<\/a>/gi, '');

    // 3. Remove empty <figure> blocks
    clean = clean.replace(/<figure[^>]*>\s*<\/figure>/gi, '');

    // 4. Remove empty <p> tags
    clean = clean.replace(/<p[^>]*>(\s|&nbsp;)*<\/p>/gi, '');

    // 5. Convert double <br> inside <p> into proper paragraph breaks
    //    WordPress often uses <p>...text...<br><br>...text...</p> instead of separate <p> tags
    clean = clean.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (_m, attrs, inner) => {
      const parts = (inner as string).split(/(?:&nbsp;|\s)*(?:<br\s*\/?>[\s]*){2,}(?:&nbsp;|\s)*/gi);
      if (parts.length <= 1) return _m;
      return parts
        .map(p => p.trim())
        .filter(p => p.length > 0)
        .map(p => `<p${attrs}>${p}</p>`)
        .join('\n');
    });

    // 5b. Collapse remaining single <br> runs
    clean = clean.replace(/(<br\s*\/?>[\s]*){2,}/gi, '<br/>');

    // 6. Strip srcset
    clean = clean.replace(/\s*srcset="[^"]*"/gi, '');

    // 7. Strip sizes
    clean = clean.replace(/\s*sizes="[^"]*"/gi, '');

    // 8. Semantic heading detection — convert pseudo-headings to <h3>
    //    Pattern A: <p><strong>"Quoted Title"</strong></p>
    clean = clean.replace(
      /<p[^>]*>\s*<strong>\s*[\u201C\u201D\u201E\u00AB\u00BB""\u2018\u2019'']*\s*([^<\u201C\u201D\u201E\u00AB\u00BB""\u2018\u2019'']{1,60}?)\s*[\u201C\u201D\u201E\u00AB\u00BB""\u2018\u2019'']*\s*<\/strong>\s*<\/p>/gi,
      '<h3>$1</h3>'
    );
    //    Pattern B: <p><strong>Short Bold Text</strong></p> (no quotes, ≤6 words, not a question)
    clean = clean.replace(
      /<p[^>]*>\s*<strong>\s*([^<]{2,50}?)\s*<\/strong>\s*<\/p>/gi,
      (_m, text) => {
        const t = text.trim();
        const words = t.split(/\s+/).length;
        // Skip questions, URLs, long sentences
        if (t.includes('?') || t.includes('http') || words > 6) return _m;
        // Skip lines ending with colon that are lead-ins (e.g. "As mudanças incluem:")
        if (t.endsWith(':') && words > 3) return _m;
        return `<h3>${t}</h3>`;
      }
    );

    // 8c. Add id attributes to all <h2> and <h3> for TOC linking
    clean = clean.replace(/<h([23])([^>]*)>([^<]+)<\/h\1>/gi, (_m, level, attrs, text) => {
      if (attrs.includes('id=')) return _m; // already has id
      const id = this.slugify(text);
      return `<h${level} id="${id}">${text}</h${level}>`;
    });

    // 9. Replace broken WordPress images
    clean = clean.replace(
      /<img([^>]*)\bsrc="https?:\/\/(?:www\.)?botschaftangola\.de[^"]*"([^>]*)>/gi,
      '<div class="wp-image-missing"><span class="material-icons-outlined">image_not_supported</span></div>'
    );
    clean = clean.replace(
      /<figure[^>]*>\s*(<div class="wp-image-missing">.*?<\/div>)\s*<\/figure>/gi,
      '$1'
    );

    // 10. Trim
    clean = clean.trim();

    // 11. Debug: color each sentence
    if (debug) {
      clean = this.colorSentences(clean);
      return this.sanitizer.bypassSecurityTrustHtml(clean);
    }

    return clean;
  }

  private colorSentences(html: string): string {
    // First pass: count sentences
    let totalSentences = 0;
    html.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (_m, _a, content) => {
      const parts = (content as string).split(
        /(?<=[.!?;])\s+(?=[A-Z\u00C0-\u00DC\u201C"<])/
      );
      totalSentences += parts.length;
      return '';
    });

    if (totalSentences === 0) return html;

    // Second pass: wrap sentences
    let idx = 0;
    const total = totalSentences;

    const result = html.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (_match, attrs, content) => {
      const parts = (content as string).split(
        /(?<=[.!?;])\s+(?=[A-Z\u00C0-\u00DC\u201C"<])/
      );

      const colored = parts.map((s: string) => {
        const hue = Math.round((idx * 360) / total) % 360;
        idx++;
        return `<span style="background:hsl(${hue},75%,85%);border-radius:2px;padding:0 2px">${s}</span>`;
      }).join(' ');

      return `<p${attrs}>${colored}</p>`;
    });

    return result;
  }

  private slugify(text: string): string {
    return text.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
