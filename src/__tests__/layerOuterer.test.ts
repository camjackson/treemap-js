import layoutRects from '../layerOuterer';

describe('layerOuterer', () => {
  const width = 1000;
  const height = 500;
  const paddingX = 10;
  const paddingY = 20;
  const doLayout = (sizes: number[], totalSize = 100) =>
    layoutRects(width, height, totalSize, sizes, paddingX, paddingY, 2.5);

  describe('layoutRects', () => {
    it('allocates the whole space, with padding, when just one child', () => {
      expect(doLayout([100])).toEqual([
        { x: 10, y: 20, width: 980, height: 460 },
      ]);
    });

    it('divides the space evenly between evenly-sized children', () => {
      expect(doLayout([50, 50])).toEqual([
        { x: 10, y: 20, width: 490, height: 460 },
        { x: 500, y: 20, width: 490, height: 460 },
      ]);
    });

    it('scales the rects based on child size', () => {
      expect(doLayout([50, 30, 20])).toEqual([
        { x: 10, y: 20, width: 490, height: 460 },
        { x: 500, y: 20, width: 294, height: 460 },
        { x: 794, y: 20, width: 196, height: 460 },
      ]);
    });

    it('can lay out squares in a regular grid', () => {
      expect(doLayout([25, 25, 25, 25])).toEqual([
        { x: 10, y: 20, width: 490, height: 230 },
        { x: 500, y: 20, width: 490, height: 230 },
        { x: 10, y: 250, width: 490, height: 230 },
        { x: 500, y: 250, width: 490, height: 230 },
      ]);
    });

    it('can lay out squares in two same-height rows', () => {
      expect(doLayout([30, 20, 10, 40])).toEqual([
        { x: 10, y: 20, width: 588, height: 230 },
        { x: 598, y: 20, width: 392, height: 230 },
        { x: 10, y: 250, width: 196, height: 230 },
        { x: 206, y: 250, width: 784, height: 230 },
      ]);
    });

    it('can lay out squares in multiple uneven rows', () => {
      // 9 elements, 3 rows
      // Total width: 980. Total height: 460
      expect(doLayout([90, 80, 70, 60, 50, 40, 30, 20, 8, 2], 450)).toEqual([
        // Row 1: Size 170
        { x: 10, y: 20, width: 518.8235294117648, height: 173.77777777777777 },
        {
          x: 528.8235294117648,
          y: 20,
          width: 461.1764705882353,
          height: 173.77777777777777,
        },
        // Row 2: Size 180
        {
          x: 10,
          y: 193.77777777777777,
          width: 381.11111111111114,
          height: 184,
        },
        {
          x: 391.11111111111114,
          y: 193.77777777777777,
          width: 326.66666666666663,
          height: 184,
        },
        {
          x: 717.7777777777778,
          y: 193.77777777777777,
          width: 272.22222222222223,
          height: 184,
        },
        // Row 3: Size 100
        {
          x: 10,
          y: 377.77777777777777,
          width: 392,
          height: 102.22222222222222,
        },
        {
          x: 402,
          y: 377.77777777777777,
          width: 294,
          height: 102.22222222222222,
        },
        {
          x: 696,
          y: 377.77777777777777,
          width: 196,
          height: 102.22222222222222,
        },
        {
          x: 892,
          y: 377.77777777777777,
          width: 78.4,
          height: 102.22222222222222,
        },
        {
          x: 970.4,
          y: 377.77777777777777,
          width: 19.6,
          height: 102.22222222222222,
        },
      ]);
    });
  });
});
