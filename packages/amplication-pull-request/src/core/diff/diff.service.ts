import { Injectable } from '@nestjs/common';
import { compare, Options } from 'dir-compare';
import { join } from 'path';
import { ChangedFile } from './dto/ChangedFile';
import { BuildsPathFactory } from './utils/BuildsPathFactory';

@Injectable()
export class DiffService {
  constructor(private readonly buildsPathFactory: BuildsPathFactory) {}
  async listOfChangedFiles(
    amplicationAppId: string,
    previousAmplicationBuildId: string,
    newAmplicationBuildId: string
  ): Promise<ChangedFile[]> {
    const { oldBuildPath, newBuildPath } =
      this.buildsPathFactory.buildsFoldersPaths(
        amplicationAppId,
        previousAmplicationBuildId,
        newAmplicationBuildId
      );

    if (oldBuildPath === newBuildPath) {
      throw new Error('Cant get the same build id');
    }

    const res = await compare(oldBuildPath, newBuildPath, compareOptions);
    const changedFiles = res.diffSet.filter((diff) => {
      if (diff.state !== 'equal') {
        return true;
      }
      return false;
    });
    return changedFiles.map((diff) => ({
      path: join(diff.relativePath, diff.name2),
    }));
  }
}

const compareOptions: Options = {
  compareContent: true,
  compareDate: false,
  compareSize: false,
  compareSymlink: false,
};