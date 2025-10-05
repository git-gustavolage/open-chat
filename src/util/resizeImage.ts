export async function resizeImage(
    base64: string,
    maxWidth: number,
    maxHeight: number,
    quality = 0.9
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            let { width, height } = img;

            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = width * ratio;
                height = height * ratio;
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) return reject(new Error("Falha ao criar contexto 2D."));

            ctx.drawImage(img, 0, 0, width, height);

            const newBase64 = canvas.toDataURL("image/jpeg", quality);
            resolve(newBase64);
        };

        img.onerror = (err) => reject(err);
        img.src = base64;
    });
}
