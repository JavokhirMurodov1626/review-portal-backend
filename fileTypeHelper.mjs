import {fileTypeFromBuffer} from 'file-type';

export async function getFileTypeFromBuffer(buffer){
    return await fileTypeFromBuffer(buffer);
}
