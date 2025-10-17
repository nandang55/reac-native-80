import { replaceBracketsWithTag } from 'utils/replaceBracketsWithTag';

describe('replaceBracketsWithTag', () => {
  it('should replace brackets with specified tag correctly', () => {
    const inputText = 'This is [bold] text.';
    const expectedOutput = 'This is <span>bold</span> text.';
    expect(replaceBracketsWithTag(inputText, 'span')).toBe(expectedOutput);
  });

  it('should handle multiple brackets and different tags correctly', () => {
    const inputText = 'This is [bold] and [italic] text.';
    const expectedOutput = 'This is <div>bold</div> and <div>italic</div> text.';
    expect(replaceBracketsWithTag(inputText, 'div')).toBe(expectedOutput);
  });

  it('should handle empty string correctly', () => {
    const inputText = '';
    const expectedOutput = '';
    expect(replaceBracketsWithTag(inputText, 'span')).toBe(expectedOutput);
  });

  it('should handle no brackets correctly', () => {
    const inputText = 'This is normal text.';
    const expectedOutput = 'This is normal text.';
    expect(replaceBracketsWithTag(inputText, 'span')).toBe(expectedOutput);
  });
});
