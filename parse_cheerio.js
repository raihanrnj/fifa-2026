import fs from 'fs';
import * as cheerio from 'cheerio';

const contentPath = '/Users/mac/.gemini/antigravity-ide/brain/f9cccb65-a09c-4ad9-9c74-b00d555be7d3/.system_generated/steps/352/content.md';
const html = fs.readFileSync(contentPath, 'utf8');

const $ = cheerio.load(html);
const links = [];
$('a').each((i, el) => {
  const href = $(el).attr('href');
  if (href) links.push(href);
});

console.log('Total links found:', links.length);
console.log('Sample links (first 50):', links.slice(0, 50));

// Let's also search if there is any div with class card or match
console.log('Matches with "match" in class:', $('[class*="match"], [class*="card"]').length);
