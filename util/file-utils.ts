import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
export const exportDataToFile = async (data: string): Promise<void> => {
    try{
        const exportPayload = {
            data,
            createdAt: new Date().toISOString(),
            version: 1,
        };
        const exportString = JSON.stringify(exportPayload);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const path = FileSystem.documentDirectory + `cycle-backup-${timestamp}.enc`;

        await FileSystem.writeAsStringAsync(path, exportString, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(path);
        } else {
            alert('Sharing is not available on this device.');
        }

    } catch (error) {
        console.error(error);
    }
}

export const importEncryptedFile = async (): Promise<string | null> => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

    if (result.canceled || !result.assets?.length) return null;

    const fileUri = result.assets[0].uri;

    const content = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
    });

    return content;
}
