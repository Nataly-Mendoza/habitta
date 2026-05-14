import { api } from "./api";

export interface ResultadoIA {
  original: string;
  generated: string;
}

export async function amoblarConIA(imageUrl: string): Promise<ResultadoIA> {
  const res = await api.post<ResultadoIA>("/ai/furnish", { image_url: imageUrl });
  return res.data;
}
