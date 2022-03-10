// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const chunk = (arr: Array<any>, size: number): Array<any> => {
  return arr.reduce(
    (acc, e, i) => (
      i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc
    ),
    []
  );
};
