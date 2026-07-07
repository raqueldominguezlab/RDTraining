/**
 * Convierte un nodo Lexical a HTML básico
 * Soporta párrafos, texto, bold, italic, underline
 */
export function lexicalToHtml(lexicalState: any): string {
  if (!lexicalState) return '';
  if (typeof lexicalState === 'string') return lexicalState;

  try {
    const root = lexicalState.root || lexicalState;
    if (!root || !root.children) return '';

    return root.children.map((node: any) => nodeToHtml(node)).join('');
  } catch (error) {
    console.error('Error converting Lexical to HTML:', error);
    return '';
  }
}

function nodeToHtml(node: any): string {
  if (!node) return '';

  // Nodo de texto
  if (node.type === 'text') {
    let html = escapeHtml(node.text || '');

    // Aplicar formatos inline
    if (node.bold) html = `<strong style="font-weight: 900; color: white; text-transform: uppercase;">${html}</strong>`;
    if (node.italic) html = `<em>${html}</em>`;
    if (node.underline) html = `<u>${html}</u>`;
    if (node.strikethrough) html = `<s>${html}</s>`;

    return html;
  }

  // Nodo de párrafo
  if (node.type === 'paragraph') {
    const children = (node.children || []).map(nodeToHtml).join('');
    return `<p>${children}</p>`;
  }

  // Nodo de encabezado
  if (node.type === 'heading') {
    const level = node.tag || 'h2';
    const children = (node.children || []).map(nodeToHtml).join('');
    return `<${level}>${children}</${level}>`;
  }

  // Nodo de lista
  if (node.type === 'ul') {
    const children = (node.children || []).map(nodeToHtml).join('');
    return `<ul>${children}</ul>`;
  }

  if (node.type === 'ol') {
    const children = (node.children || []).map(nodeToHtml).join('');
    return `<ol>${children}</ol>`;
  }

  if (node.type === 'li') {
    const children = (node.children || []).map(nodeToHtml).join('');
    return `<li>${children}</li>`;
  }

  // Nodo de enlace
  if (node.type === 'link') {
    const children = (node.children || []).map(nodeToHtml).join('');
    const url = escapeHtml(node.url || '#');
    return `<a href="${url}" target="${node.target || '_self'}">${children}</a>`;
  }

  // Nodo de bloque de código
  if (node.type === 'code') {
    const children = (node.children || []).map(nodeToHtml).join('');
    const language = node.language || '';
    return `<pre><code${language ? ` class="language-${language}"` : ''}>${children}</code></pre>`;
  }

  // Nodo de cita
  if (node.type === 'quote') {
    const children = (node.children || []).map(nodeToHtml).join('');
    return `<blockquote>${children}</blockquote>`;
  }

  // Por defecto, procesar children
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(nodeToHtml).join('');
  }

  return '';
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
