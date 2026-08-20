import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { destinationZip } = await request.json();

    if (!destinationZip) {
      return NextResponse.json({ error: "Falta código postal" }, { status: 400 });
    }

    const accountId = "21697";
    const originId = "380239";
    const zipnovaKey = "2163c81c-a8a1-4f31-b678-98d1325234c2";
    const zipnovaSecret = "44bf2d1a-67cc-4447-83dc-2352fcc59abc";

    // Basic Auth
    const authHeader = "Basic " + Buffer.from(`${zipnovaKey}:${zipnovaSecret}`).toString('base64');

    const payload = {
      account_id: parseInt(accountId),
      origin_id: parseInt(originId),
      destination: {
        zip_code: destinationZip
      },
      packages: [
        {
          weight: 1, // 1 kg
          width: 20, // 20 cm
          height: 20, // 20 cm
          depth: 20  // 20 cm
        }
      ]
    };

    console.log("Zipnova Quote Payload:", JSON.stringify(payload));

    const response = await fetch("https://api.zipnova.com.ar/v2/shipments/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Zipnova API Error:", data);
      return NextResponse.json({ error: "Error cotizando en Zipnova", details: data }, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Zipnova Internal Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
