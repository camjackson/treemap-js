export type InputFileWithSize = {
  fullPath: string; // path with slashes
  size: number;
};

export class TreeNode {
  constructor(
    public name: string,
    public size: number,
    public children: TreeNode[],
  ) {}

  static newFile(name: string, size: number) {
    return new TreeNode(name, size, null);
  }

  static newDirectory(name: string) {
    return new TreeNode(name, 0, []);
  }

  public addFile = (inputFile: InputFileWithSize) => {
    this.size += inputFile.size;
    const [firstPathSegment, ...otherPathSegments] = inputFile.fullPath.split(
      '/',
    );

    if (otherPathSegments.length === 0) {
      this.children.push(TreeNode.newFile(firstPathSegment, inputFile.size));
    } else {
      const inputWithoutFirstPathSegment: InputFileWithSize = {
        fullPath: otherPathSegments.join('/'),
        size: inputFile.size,
      };

      this.getOrAddSubDirectory(firstPathSegment).addFile(
        inputWithoutFirstPathSegment,
      );
    }
  };

  public sortRecursive() {
    if (this.children) {
      this.children.forEach(child => child.sortRecursive());

      this.children.sort((child1, child2) => {
        if (child1.size > child2.size) return -1;
        if (child1.size < child2.size) return 1;
        return 0;
      });
    }

    return this;
  }

  private getOrAddSubDirectory(name: string): TreeNode {
    let result: TreeNode = this.children.find(child => child.name === name);

    if (!result) {
      result = TreeNode.newDirectory(name);
      this.children.push(result);
    }

    return result;
  }
}

const buildTreeData = (rawData: InputFileWithSize[]): TreeNode => {
  const result: TreeNode = TreeNode.newDirectory('.');

  rawData.forEach(result.addFile);

  return result.sortRecursive();
};

export default buildTreeData;
