import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { destinationZip, cartTotal } = await request.json();

    if (!destinationZip) {
      return NextResponse.json({ error: "Falta código postal" }, { status: 400 });
    }

    const accountId = "21697";
    const originId = "380239";
    const zipnovaKey = "2163e81c-a8a1-4f31-b678-98d1325234e2";
    const zipnovaSecret = "44bf2d1a-67ee-4447-83dc-2352fce59abc";

    // Basic Auth
    const authHeader = "Basic " + Buffer.from(`${zipnovaKey}:${zipnovaSecret}`).toString('base64');

    const payload = {
      account_id: parseInt(accountId),
      origin_id: parseInt(originId),
      declared_value: cartTotal || 10000,
      destination: {
        zipcode: destinationZip,
        city: "Ciudad", // placeholder needed for quote
        state: "Provincia" // placeholder needed for quote
      },
      packages: [
        {
          weight: 1000, // 1000 grams = 1kg
          width: 20, 
          height: 20, 
          length: 20,
          classification_id: 1 // 1=caja
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
