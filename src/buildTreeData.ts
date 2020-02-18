export type InputFileWithSize = {
  fullPath: string; // path with slashes
  size: number;
};

export class TreeNode {
  constructor(
    public name: string,
    public size: number,
    public children: TreeNode[],
    public parent: TreeNode,
  ) {}

  static newFile(name: string, size: number, parent: TreeNode) {
    return new TreeNode(name, size, null, parent);
  }

  static newDirectory(name: string, parent: TreeNode) {
    return new TreeNode(name, 0, [], parent);
  }

  public addFile = (inputFile: InputFileWithSize) => {
    this.size += inputFile.size;
    const [firstPathSegment, ...otherPathSegments] = inputFile.fullPath.split(
      '/',
    );

    if (otherPathSegments.length === 0) {
      this.children.push(
        TreeNode.newFile(firstPathSegment, inputFile.size, this),
      );
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
      result = TreeNode.newDirectory(name, this);
      this.children.push(result);
    }

    return result;
  }
}

export const buildTreeData = (rawData: InputFileWithSize[]): TreeNode => {
  const result: TreeNode = TreeNode.newDirectory('.', null);

  rawData.forEach(result.addFile);

  return result.sortRecursive();
};

const excludes = [/^header$/, /^SUM$/, /package-lock.json/];
export const buildTreeDataFromClocData = (data: any): TreeNode => {
  // Generate with e.g. `cloc --exclude-dir node_modules --by-file --json .`
  const fileNames = Object.keys(data).filter((name: string) => {
    return excludes.reduce(
      (okSoFar: boolean, exclude) => okSoFar && !name.match(exclude),
      true,
    );
  });

  const inputFiles: InputFileWithSize[] = fileNames.map(name => ({
    fullPath: name.replace(/^.\//, ''),
    size: data[name].code,
  }));

  return buildTreeData(inputFiles);
};
