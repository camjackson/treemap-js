export type InputFileWithSize = {
  fullPath: string; // path with slashes
  size: number;
};

export class OutputFileWithSize {
  constructor(
    private name: string,
    private size: number,
    private children: OutputFileWithSize[],
  ) {}

  static newFile(name: string, size: number) {
    return new OutputFileWithSize(name, size, null);
  }

  static newDirectory(name: string) {
    return new OutputFileWithSize(name, 0, []);
  }

  public addFile = (inputFile: InputFileWithSize) => {
    this.size += inputFile.size;
    const [firstPathSegment, ...otherPathSegments] = inputFile.fullPath.split(
      '/',
    );

    if (otherPathSegments.length === 0) {
      this.children.push(
        OutputFileWithSize.newFile(firstPathSegment, inputFile.size),
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

  private getOrAddSubDirectory(name: string): OutputFileWithSize {
    let result: OutputFileWithSize = this.children.find(
      child => child.name === name,
    );

    if (!result) {
      result = OutputFileWithSize.newDirectory(name);
      this.children.push(result);
    }

    return result;
  }
}

const buildTreeData = (rawData: InputFileWithSize[]): OutputFileWithSize => {
  const result: OutputFileWithSize = OutputFileWithSize.newDirectory('.');

  rawData.forEach(result.addFile);

  return result;
};

export default buildTreeData;
