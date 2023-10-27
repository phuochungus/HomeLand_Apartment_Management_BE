import { Injectable } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Upload service interface
 */
export abstract class StorageManager {
    /**
     * Upload a file to storage and return the URL
     * @param file file must have buffer property
     * @param path path to upload on remote storage
     * @param mime MIME type of file
     */
    abstract upload(
        file: { buffer: Buffer | ArrayBuffer },
        path: string,
        mime?: string,
    ): Promise<string>;

    /**
     * @param paths path to files will be remove on bucket
     */
    abstract remove(paths: string[]): Promise<boolean>;

    /**
     * Initiate storage if not exist
     */
    abstract initiateStorage(): Promise<void>;

    /**
     * Destroy storage if exist
     */
    abstract destroyStorage(): Promise<void>;
}

@Injectable()
export class SupabaseStorageManager extends StorageManager {
    constructor(private readonly supabaseClient: SupabaseClient) {
        super();
    }
    async destroyStorage() {
        await this.supabaseClient.storage.emptyBucket(this.BUCKET_NAME);
        await this.supabaseClient.storage.deleteBucket(this.BUCKET_NAME);
    }

    async initiateStorage() {
        await this.supabaseClient.storage.createBucket(this.BUCKET_NAME, {
            public: true,
        });
    }

    private readonly BUCKET_NAME = "homeland";

    async remove(paths: string[]): Promise<boolean> {
        const { error } = await this.supabaseClient.storage
            .from(this.BUCKET_NAME)
            .remove(paths);

        if (error) throw error;
        return true;
    }

    async upload(
        file: { buffer: Buffer },
        uploadPath: string,
        mime: string = "text/plain;charset=UTF-8",
    ): Promise<string> {
        if (!file.buffer) throw new Error("File must have buffer property");
        const { error } = await this.supabaseClient.storage
            .from(this.BUCKET_NAME)
            .upload(uploadPath, file.buffer, {
                contentType: mime,
                upsert: true,
            });

        if (error) throw error;
        const response = this.supabaseClient.storage
            .from(this.BUCKET_NAME)
            .getPublicUrl(uploadPath);
        return response.data.publicUrl;
    }
}
