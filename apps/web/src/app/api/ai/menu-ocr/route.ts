import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { menuText, imageBase64, mimeType = 'image/jpeg' } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured on the server.' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an expert Restaurant Menu OCR and structuring engine.
Analyze the provided restaurant menu (text or image) and extract all categories and dishes.
Return ONLY valid JSON matching this schema, without markdown formatting or codeblocks:
{
  "categories": [
    {
      "name": "Category Name",
      "items": [
        {
          "name": "Dish Name",
          "description": "Short dish description or ingredients",
          "price": 250,
          "foodType": "VEG" | "NON_VEG" | "BEVERAGE"
        }
      ]
    }
  ]
}`;

    let contents: any[] = [];

    if (imageBase64) {
      // Clean base64 prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      contents = [
        {
          role: 'user',
          parts: [
            { text: systemPrompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: cleanBase64,
              },
            },
          ],
        },
      ];
    } else {
      contents = [
        {
          role: 'user',
          parts: [
            { text: `${systemPrompt}\n\nHere is the raw printed menu text to extract:\n${menuText || 'No menu text provided'}` },
          ],
        },
      ];
    }

    // Call Gemini REST API directly using gemini-2.5-flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error:', errText);
      return NextResponse.json(
        { error: `Gemini API returned error: ${response.status}`, details: errText },
        { status: response.status }
      );
    }

    const geminiData = await response.json();
    const candidateText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    let parsedResult;
    try {
      parsedResult = JSON.parse(candidateText);
    } catch {
      // Fallback clean
      const cleaned = candidateText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleaned);
    }

    return NextResponse.json({
      success: true,
      data: parsedResult,
    });
  } catch (error: any) {
    console.error('Menu OCR handler exception:', error);
    return NextResponse.json(
      { error: 'Failed to process menu with Gemini AI.', message: error.message },
      { status: 500 }
    );
  }
}
