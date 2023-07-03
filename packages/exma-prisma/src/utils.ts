export function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export function formatCode(code: string): string {
  code = code
    .replace(/\}\s+else\s+if\s+\(/g, '} else if (')
    .replace(/\s*\n\s*\n\s*/g, "\n")
    .trim();
  const lines = code.split("\n");
  let indent = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/^\}/g) || line.match(/^\)/g)) {
      indent -= 2;
    }
    lines[i] = `${' '.repeat(indent)}${line}`;
    if (line.match(/\s*\{\s*$/g) || line.match(/\s*\(\s*$/g)) {
      indent += 2;
    }
  }
  return lines.join("\n");
};

export function camelfy(str: string, lower = true) {
  const camel = str.trim()
    //replace special characters with underscores
    .replace(/[^a-zA-Z0-9]/g, '_')
    //replace multiple underscores with a single underscore
    .replace(/_{2,}/g, '_')
    //trim underscores from the beginning and end of the string
    .replace(/^_+|_+$/g, '')
    //replace underscores with capital
    .replace(/([-_][a-z0-9])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  if (lower) {
    //return lowercase first char
    return camel.charAt(0).toLowerCase() + camel.slice(1);
  }

  return camel.charAt(0).toUpperCase() + camel.slice(1);
};