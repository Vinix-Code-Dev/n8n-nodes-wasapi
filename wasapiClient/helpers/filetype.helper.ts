export type FileType = 'image_url' | 'video_url' | 'document_url' | 'audio_url';
export type TemplateFileType = 'image' | 'video' | 'document' | 'audio';

export function getFileType(filePath: string): FileType {
    const extension = filePath.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image_url';
    if (['mp4', 'avi', 'mov', 'wmv'].includes(extension)) return 'video_url';
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) return 'audio_url';
    return 'document_url';
}



export function getTemplateFileType(urlFile: string): TemplateFileType {
    const extension = urlFile.split('.').pop()?.toLowerCase() || '';

    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension))return 'image';
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', '3gp'].includes(extension)) return 'video';
    if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'wma'].includes(extension)) return 'audio';
    return 'document';
}
