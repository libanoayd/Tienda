import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get("folderId");

  if (!folderId) {
    return NextResponse.json({ error: "Falta folderId" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Falta API Key de Google Drive" }, { status: 500 });
  }

  try {
    const q = `'${folderId}' in parents and trashed = false`;
    const fields = "files(id, name, mimeType, thumbnailLink, webContentLink)";
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=${encodeURIComponent(fields)}&key=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      console.error("Google Drive API Error:", data);
      return NextResponse.json({ error: data.error?.message || "Error al leer Drive" }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error conectando a Drive:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
