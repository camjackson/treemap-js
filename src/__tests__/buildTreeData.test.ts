import { buildTreeData, InputFileWithSize, TreeNode } from '../buildTreeData';

describe('thing', () => {
  const inputFiles: InputFileWithSize[] = [
    { fullPath: 'something', size: 100 },
    { fullPath: 'something-else', size: 200 },
    { fullPath: 'nested/first', size: 10 },
    { fullPath: 'nested/second', size: 20 },
    { fullPath: 'nested/something/deeply/nested', size: 3 },
  ];

  it('works', () => {
    const result: TreeNode = buildTreeData(inputFiles);

    expect(result).toEqual(
      expect.objectContaining({
        name: '.',
        size: 333,
        children: [
          expect.objectContaining({
            name: 'something-else',
            size: 200,
            children: null,
          }),
          expect.objectContaining({
            name: 'something',
            size: 100,
            children: null,
          }),
          expect.objectContaining({
            name: 'nested',
            size: 33,
            children: [
              expect.objectContaining({
                name: 'second',
                size: 20,
                children: null,
              }),
              expect.objectContaining({
                name: 'first',
                size: 10,
                children: null,
              }),
              expect.objectContaining({
                name: 'something',
                size: 3,
                children: [
                  expect.objectContaining({
                    name: 'deeply',
                    size: 3,
                    children: [
                      expect.objectContaining({
                        name: 'nested',
                        size: 3,
                        children: null,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    );
  });
});
