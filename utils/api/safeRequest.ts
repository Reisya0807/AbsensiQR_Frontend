type ApiResponse<T> = 
  | { data: T; error: null } 
  | { data: null; error: { status: number; message: string } };

async function safeRequest<T>(promise: Promise<Response>): Promise<ApiResponse<T>> {
    try {
        const response = await promise;
        if (!response.ok) {
            throw { status: response.status, message: `Error ${response.status}` };
        }
        const data = await response.json();
        return { data: data as T, error: null };
    } catch (err) {
        const error = err as { status?: number; message?: string };
        return { 
            data: null, 
            error: {
                status: error.status || 500,
                message: error.message || "Masalah Koneksi"
            } 
        };
    }
}
export type {ApiResponse}
export default safeRequest