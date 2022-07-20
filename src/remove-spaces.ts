export default function removeSpaces(params: {
  text: string;
  leading: boolean;
  trailing: boolean;
  preserveIndent: boolean;
}) {
  let regex: RegExp;
  const { text, leading, trailing, preserveIndent } = params;
  let spaceCountPattern: string | undefined;
  let leadingMatch: string;
  if (leading) {
    if (preserveIndent) {
      const firstSpacePattern = new RegExp(String.raw`^(\s*).+?((\r\n)|\n|$)`);
      const firstSpaces = text.match(firstSpacePattern)?.[1];
      const spaceCount = firstSpaces?.length;
      spaceCountPattern = `{0,${spaceCount}}`;
    } else {
      spaceCountPattern = '*';
    }
    leadingMatch = String.raw`\s${spaceCountPattern}`;
  } else {
    leadingMatch = '';
  }
  const trailingMatch = trailing ? String.raw`\s*?` : '';
  regex = new RegExp(String.raw`((()((\r\n)|\n))|(.*?((\r\n)|\n|$)))`, 'g');
  const lines = text.match(regex);
  const lineRegex = new RegExp(
    String.raw`^${leadingMatch}(.*?)${trailingMatch}((\r\n)|\n|$)`,
    'g'
  );
  const result = lines
    ?.map((line) => {
      if (line === '\r\n' || line === '\n') return line;
      return line.replace(lineRegex, '$1$2');
    })
    .join('');
  return result;
}
