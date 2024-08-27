import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class FileService {
  constructor(private http: HttpClient) {}

  /**
   * Fetches image data from the given URL and creates a File object.
   * @param imageUrl The URL of the image.
   * @param fileName The name of the file to be created.
   */
  async createFileFromImageUrl(
    imageUrl: string,
    fileName: string | null
  ): Promise<File> {
    if (fileName == null) fileName = this.getFileNameFromUrl(imageUrl);
    return new Promise((resolve, reject) => {
      console.log("downloading file");

      // Fetch image data as Blob
      this.http
        .get(imageUrl, { responseType: "blob" })
        .toPromise()
        .then((blob: Blob | undefined) => {
          console.log("blob fetched", blob);

          // Create File from Blob
          if (blob != undefined) {
            const file = new File([blob], fileName ?? "unknown", {
              type: blob.type,
            });
            resolve(file);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async downloadImageAsFile(imageUrl: string): Promise<File | null> {
    const fileName = this.getFileNameFromUrl(imageUrl);
    try {
      const response = await this.http
        .get(imageUrl, { responseType: "blob" })
        .toPromise();
      if (!response) {
        return null;
      }
      const file = new File([response], fileName, { type: "image/jpeg" });
      return file;
    } catch (error) {
      console.error("Error downloading image:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
  getFileNameFromUrl(url: string): string {
    if (url == null || url == "") return "";
    // Split the URL by forward slashes
    const parts = url.split("/");
    // Extract the last part (file name)
    const fileName = parts[parts.length - 1];
    return fileName;
  }
  getFileType(url: string): string {
    // Extract the file extension from the URL
    const extension = url.split(".").pop()?.toLowerCase();

    // Define the possible file types
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "mkv"];
    const audioExtensions = ["mp3", "wav", "aac", "flac", "ogg", "m4a"];
    const docExtensions = ["docx", "pdf"];

    // Determine the file type based on the extension
    if (extension) {
      if (imageExtensions.includes(extension)) {
        return "image";
      } else if (videoExtensions.includes(extension)) {
        return "video";
      } else if (audioExtensions.includes(extension)) {
        return "audio";
      } else if (docExtensions.includes(extension)) {
        return "document";
      }
    }

    // Return 'unknown' if the file type is not recognized
    return "unknown";
  }

  async downloadImage(imageUrl: string) {
    this.http.get(imageUrl, { responseType: "blob" }).subscribe(
      (response) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // 'result' contains the base64 encoded image data
          const base64data = reader.result as string;
          console.log(base64data);
          return base64data;
        };
        reader.readAsDataURL(response);
      },
      (error) => {
        console.error("Error downloading image:", error);
      }
    );
  }
}
