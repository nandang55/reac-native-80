export const replaceBracketsWithTag = (text: string, tag: string) => {
  const openTag = `<${tag}>`;
  const closeTag = `</${tag}>`;
  return text.replace(/\[/g, openTag).replace(/\]/g, closeTag);
};
