import { expect } from 'chai';

import { chunk } from '../../../src/utils';

describe('Array#chunk', () => {
  it('returns array with a child array if number of elements in array is less than or equal to size', () => {
    const arr = [1, 2, 3];
    expect(chunk(arr, 4)).to.deep.eq([arr]);
  });

  it('returns array of array after chunking', () => {
    const arr = [1, 2, 3];
    expect(chunk(arr, 2)).to.deep.eq([[1, 2], [3]]);
  });
});
