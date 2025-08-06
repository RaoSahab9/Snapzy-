import archiver from 'archiver';
import fs from 'fs-extra';
import path from 'path';
import { ProjectFile } from '@/types';

export const createProjectZip = async (
  files: ProjectFile[],
  projectTitle: string
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Sets the compression level
    });

    const chunks: Buffer[] = [];

    archive.on('data', (chunk) => {
      chunks.push(chunk);
    });

    archive.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });

    archive.on('error', (err) => {
      reject(err);
    });

    // Add files to the archive
    files.forEach((file) => {
      if (file.type === 'file') {
        archive.append(file.content, { name: file.path });
      }
    });

    archive.finalize();
  });
};

export const ensureDirectoryExists = async (dirPath: string): Promise<void> => {
  try {
    await fs.ensureDir(dirPath);
  } catch (error) {
    console.error('Error creating directory:', error);
    throw error;
  }
};

export const writeFile = async (filePath: string, content: string): Promise<void> => {
  try {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf8');
  } catch (error) {
    console.error('Error writing file:', error);
    throw error;
  }
};

export const readFile = async (filePath: string): Promise<string> => {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
};

export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    await fs.remove(filePath);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

export const getFileSize = (content: string): number => {
  return Buffer.byteLength(content, 'utf8');
};

export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
};

export const createFileTree = (files: ProjectFile[]): any[] => {
  const tree: any[] = [];
  const fileMap = new Map<string, any>();

  files.forEach((file) => {
    const pathParts = file.path.split('/');
    let currentPath = '';

    pathParts.forEach((part, index) => {
      const isFile = index === pathParts.length - 1;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!fileMap.has(currentPath)) {
        const node = {
          name: part,
          path: currentPath,
          type: isFile ? 'file' : 'directory',
          children: isFile ? undefined : [],
          content: isFile ? file.content : undefined,
          size: isFile ? file.size : 0,
        };

        fileMap.set(currentPath, node);

        if (index === 0) {
          tree.push(node);
        } else {
          const parentPath = pathParts.slice(0, index).join('/');
          const parent = fileMap.get(parentPath);
          if (parent && parent.children) {
            parent.children.push(node);
          }
        }
      }
    });
  });

  return tree;
};