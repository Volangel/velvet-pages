import { Book } from '@/types';

interface EpubOptions {
  title: string;
  author: string;
  publisher?: string;
  cover?: string;
  content: { title: string; data: string }[];
  description?: string;
  genre?: string;
  keywords?: string[];
  seriesName?: string;
  seriesNumber?: number;
  aiGenerated?: boolean;
  contentWarnings?: string[];
}

export async function generateEpub(book: Book): Promise<Blob> {
  // Create EPUB structure with all KDP-required elements
  const epub = new EpubBuilder({
    title: book.title,
    author: book.penName || 'Anonymous',
    description: book.metadata.description || book.synopsis,
    genre: book.genre,
    keywords: book.metadata.keywords,
    cover: book.coverImage,
    seriesName: book.series?.name,
    seriesNumber: book.series?.bookNumber,
    aiGenerated: book.metadata.aiContentDisclosure,
    contentWarnings: book.metadata.contentWarnings,
    content: book.chapters
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(chapter => ({
        title: chapter.title,
        data: formatChapterContent(chapter.content),
      })),
  });

  return epub.build();
}

function formatChapterContent(content: string): string {
  // Convert plain text to HTML with proper paragraph breaks
  const paragraphs = content.split(/\n\n+/);
  return paragraphs
    .map(p => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      // Handle scene breaks
      if (trimmed === '***' || trimmed === '---' || trimmed === '* * *') {
        return '<hr class="scene-break" />';
      }
      return `<p>${escapeHtml(trimmed).replace(/\n/g, '<br/>')}</p>`;
    })
    .filter(p => p)
    .join('\n');
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

class EpubBuilder {
  private options: EpubOptions;

  constructor(options: EpubOptions) {
    this.options = options;
  }

  async build(): Promise<Blob> {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // Mimetype must be first and uncompressed
    zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

    // META-INF
    zip.folder('META-INF')?.file('container.xml', this.getContainerXml());

    // OEBPS folder
    const oebps = zip.folder('OEBPS');
    if (!oebps) throw new Error('Failed to create OEBPS folder');

    // Content files
    oebps.file('content.opf', this.getContentOpf());
    oebps.file('toc.ncx', this.getTocNcx());
    oebps.file('nav.xhtml', this.getNavXhtml());
    oebps.file('styles.css', this.getStyles());
    
    // Front matter
    oebps.file('title.xhtml', this.getTitlePage());
    oebps.file('copyright.xhtml', this.getCopyrightPage());

    // Chapter files
    this.options.content.forEach((chapter, index) => {
      oebps.file(`chapter${index + 1}.xhtml`, this.getChapterXhtml(chapter, index + 1));
    });

    // Back matter - Critical for KDP revenue!
    oebps.file('backmatter.xhtml', this.getBackMatterPage());

    // Cover image if provided
    if (this.options.cover && this.options.cover.startsWith('data:')) {
      const coverData = this.options.cover.split(',')[1];
      const coverType = this.options.cover.split(';')[0].split('/')[1];
      oebps.file(`cover.${coverType}`, coverData, { base64: true });
    }

    return zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
  }

  private getCopyrightPage(): string {
    const year = new Date().getFullYear();
    const warnings = this.options.contentWarnings?.length 
      ? `<p><strong>Content Warnings:</strong> ${this.options.contentWarnings.join(', ')}</p>`
      : '';
    const aiDisclosure = this.options.aiGenerated
      ? `<p><em>This work contains content created with AI assistance.</em></p>`
      : '';
    const seriesInfo = this.options.seriesName
      ? `<p><strong>${this.options.seriesName}</strong> - Book ${this.options.seriesNumber || 1}</p>`
      : '';

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Copyright</title>
  <link rel="stylesheet" type="text/css" href="styles.css"/>
</head>
<body>
  <div class="copyright-page">
    ${seriesInfo}
    <p><strong>${escapeHtml(this.options.title)}</strong></p>
    <p>Copyright © ${year} ${escapeHtml(this.options.author)}</p>
    <p>All rights reserved.</p>
    <p>This is a work of fiction. Names, characters, places, and incidents either are the product of the author's imagination or are used fictitiously. Any resemblance to actual persons, living or dead, events, or locales is entirely coincidental.</p>
    ${warnings}
    ${aiDisclosure}
    <p>No part of this book may be reproduced in any form or by any electronic or mechanical means, including information storage and retrieval systems, without written permission from the author, except for the use of brief quotations in a book review.</p>
  </div>
</body>
</html>`;
  }

  private getBackMatterPage(): string {
    const seriesPromo = this.options.seriesName ? `
    <div class="section">
      <h2>More from the ${escapeHtml(this.options.seriesName)} Series</h2>
      <p>Did you love this book? The adventure continues!</p>
      <p>Search for "<strong>${escapeHtml(this.options.seriesName)}</strong>" on Amazon to find all books in this series.</p>
    </div>` : '';

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Thank You</title>
  <link rel="stylesheet" type="text/css" href="styles.css"/>
</head>
<body>
  <div class="back-matter">
    <h1>Thank You for Reading!</h1>
    
    <div class="section">
      <h2>Did You Enjoy This Book?</h2>
      <p>If you loved <strong>${escapeHtml(this.options.title)}</strong>, please consider leaving a review on Amazon!</p>
      <p>Your reviews help other readers discover my books and mean the world to me. Even a few words make a huge difference! ⭐⭐⭐⭐⭐</p>
    </div>

    ${seriesPromo}

    <div class="section">
      <h2>Stay Connected</h2>
      <p>Want to be the first to know about new releases, exclusive content, and special deals?</p>
      <p><strong>Join my newsletter!</strong></p>
      <p>Subscribers get:</p>
      <ul>
        <li>Exclusive bonus scenes</li>
        <li>Early access to new books</li>
        <li>Cover reveals and sneak peeks</li>
        <li>Special subscriber-only giveaways</li>
      </ul>
      <p><em>[Add your newsletter signup link here]</em></p>
    </div>

    <div class="section">
      <h2>About ${escapeHtml(this.options.author)}</h2>
      <p>${escapeHtml(this.options.author)} writes steamy ${escapeHtml(this.options.genre || 'romance')} featuring swoon-worthy heroes and strong heroines who fight for their happily ever after.</p>
      <p><em>[Personalize this bio with your own story]</em></p>
    </div>

    <div class="section">
      <h2>More Books by ${escapeHtml(this.options.author)}</h2>
      <p>Search for "${escapeHtml(this.options.author)}" on Amazon to discover all my books!</p>
    </div>
  </div>
</body>
</html>`;
  }

  private getContainerXml(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
  }

  private getContentOpf(): string {
    const uuid = crypto.randomUUID();
    const chapters = this.options.content
      .map((_, i) => `<item id="chapter${i + 1}" href="chapter${i + 1}.xhtml" media-type="application/xhtml+xml"/>`)
      .join('\n    ');
    const spine = this.options.content
      .map((_, i) => `<itemref idref="chapter${i + 1}"/>`)
      .join('\n    ');
    
    const coverItem = this.options.cover 
      ? `<item id="cover-image" href="cover.${this.options.cover.split(';')[0].split('/')[1]}" media-type="${this.options.cover.split(';')[0].replace('data:', '')}"/>`
      : '';

    // Series metadata for KDP
    const seriesMeta = this.options.seriesName
      ? `<meta property="belongs-to-collection" id="series">${escapeHtml(this.options.seriesName)}</meta>
    <meta refines="#series" property="collection-type">series</meta>
    <meta refines="#series" property="group-position">${this.options.seriesNumber || 1}</meta>`
      : '';

    return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="BookId">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:identifier id="BookId">urn:uuid:${uuid}</dc:identifier>
    <dc:title>${escapeHtml(this.options.title)}</dc:title>
    <dc:creator>${escapeHtml(this.options.author)}</dc:creator>
    <dc:language>en</dc:language>
    <dc:description>${escapeHtml(this.options.description || '')}</dc:description>
    <dc:subject>${escapeHtml(this.options.genre || 'Romance')}</dc:subject>
    <meta property="dcterms:modified">${new Date().toISOString().split('.')[0]}Z</meta>
    ${this.options.cover ? '<meta name="cover" content="cover-image"/>' : ''}
    ${seriesMeta}
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="css" href="styles.css" media-type="text/css"/>
    <item id="title" href="title.xhtml" media-type="application/xhtml+xml"/>
    <item id="copyright" href="copyright.xhtml" media-type="application/xhtml+xml"/>
    ${coverItem}
    ${chapters}
    <item id="backmatter" href="backmatter.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="title"/>
    <itemref idref="copyright"/>
    ${spine}
    <itemref idref="backmatter"/>
  </spine>
</package>`;
  }

  private getTocNcx(): string {
    const navPoints = this.options.content
      .map((chapter, i) => `
    <navPoint id="navPoint-${i + 2}" playOrder="${i + 2}">
      <navLabel><text>${escapeHtml(chapter.title)}</text></navLabel>
      <content src="chapter${i + 1}.xhtml"/>
    </navPoint>`)
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${crypto.randomUUID()}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${escapeHtml(this.options.title)}</text></docTitle>
  <navMap>
    <navPoint id="navPoint-1" playOrder="1">
      <navLabel><text>Title Page</text></navLabel>
      <content src="title.xhtml"/>
    </navPoint>${navPoints}
  </navMap>
</ncx>`;
  }

  private getNavXhtml(): string {
    const navItems = this.options.content
      .map((chapter, i) => `<li><a href="chapter${i + 1}.xhtml">${escapeHtml(chapter.title)}</a></li>`)
      .join('\n        ');

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>Table of Contents</title>
  <link rel="stylesheet" type="text/css" href="styles.css"/>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Table of Contents</h1>
    <ol>
      <li><a href="title.xhtml">Title Page</a></li>
      <li><a href="copyright.xhtml">Copyright</a></li>
      ${navItems}
      <li><a href="backmatter.xhtml">About the Author</a></li>
    </ol>
  </nav>
</body>
</html>`;
  }

  private getTitlePage(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${escapeHtml(this.options.title)}</title>
  <link rel="stylesheet" type="text/css" href="styles.css"/>
</head>
<body>
  <div class="title-page">
    <h1 class="book-title">${escapeHtml(this.options.title)}</h1>
    <p class="author">by ${escapeHtml(this.options.author)}</p>
  </div>
</body>
</html>`;
  }

  private getChapterXhtml(chapter: { title: string; data: string }, num: number): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${escapeHtml(chapter.title)}</title>
  <link rel="stylesheet" type="text/css" href="styles.css"/>
</head>
<body>
  <section class="chapter" id="chapter${num}">
    <h2 class="chapter-title">${escapeHtml(chapter.title)}</h2>
    ${chapter.data}
  </section>
</body>
</html>`;
  }

  private getStyles(): string {
    return `
body {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1em;
  line-height: 1.6;
  margin: 1em;
  text-align: justify;
}

.title-page {
  text-align: center;
  padding-top: 30%;
}

.book-title {
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 0.5em;
  font-style: italic;
}

.author {
  font-size: 1.5em;
  margin-top: 1em;
}

.chapter {
  page-break-before: always;
}

.chapter-title {
  font-size: 1.8em;
  text-align: center;
  margin-bottom: 2em;
  font-style: italic;
}

p {
  text-indent: 1.5em;
  margin: 0;
  padding: 0;
}

p:first-of-type {
  text-indent: 0;
}

hr.scene-break {
  border: none;
  text-align: center;
  margin: 2em 0;
}

hr.scene-break:before {
  content: "* * *";
  font-size: 1.2em;
}

nav#toc h1 {
  font-size: 1.5em;
  margin-bottom: 1em;
}

nav#toc ol {
  list-style-type: none;
  padding-left: 0;
}

nav#toc li {
  margin: 0.5em 0;
}

nav#toc a {
  text-decoration: none;
  color: inherit;
}

/* Copyright Page */
.copyright-page {
  text-align: center;
  padding-top: 20%;
  font-size: 0.9em;
}

.copyright-page p {
  text-indent: 0;
  margin: 0.5em 0;
}

/* Back Matter */
.back-matter {
  page-break-before: always;
}

.back-matter h1 {
  text-align: center;
  font-size: 1.8em;
  margin-bottom: 1.5em;
}

.back-matter .section {
  margin: 2em 0;
}

.back-matter .section h2 {
  font-size: 1.3em;
  margin-bottom: 0.5em;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.3em;
}

.back-matter p {
  text-indent: 0;
  margin: 0.5em 0;
}

.back-matter ul {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.back-matter li {
  margin: 0.3em 0;
}
`;
  }
}

