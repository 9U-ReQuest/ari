import fs from "fs";
import path from "path";

type FileTree = {
    path: string; // 파일의 전체 경로
    name: string; // 파일 이름
    isDirectory: boolean; // 디렉터리 여부
    children?: FileTree[]; // 디렉터리인 경우 자식 노드
};

export const getProjectFileTree = async (directory: string): Promise<FileTree[]> => {
    const result: FileTree[] = [];
    const items = fs.readdirSync(directory);

    for (const item of items) {
        const itemPath = path.join(directory, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            result.push({
                path: itemPath,
                name: item,
                isDirectory: true,
                children: await getProjectFileTree(itemPath),
            });
        } else {
            result.push({
                path: itemPath,
                name: item,
                isDirectory: false,
            });
        }
    }

    return result;
}

export const extractFilePaths = (fileTree: FileTree[]): string[] => {
    const filePaths: string[] = [];

    for (const node of fileTree) {
        if (node.isDirectory && node.children) {
            filePaths.push(...extractFilePaths(node.children));
        } else if (!node.isDirectory) {
            filePaths.push(node.path);
        }
    }

    return filePaths;
}