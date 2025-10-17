import { act, renderHook } from '@testing-library/react-hooks';
import useDebounce from 'hooks/useDebounce';

describe('useDebounce', () => {
  it('should debounce the value', () => {
    jest.useFakeTimers();

    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: {
        value: 'initialValue',
        delay: 500
      }
    });

    act(() => {
      jest.advanceTimersByTime(250);
      rerender({ value: 'initialValue', delay: 500 });
    });

    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(result.current).toBe('initialValue');

    act(() => {
      jest.advanceTimersByTime(250);
      rerender({ value: 'updatedValue', delay: 500 });
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updatedValue');

    jest.useRealTimers();
  });
});
