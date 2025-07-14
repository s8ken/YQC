import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`

  return NextResponse.json({
    message: "Webhook endpoints are working!",
    baseUrl,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      `${baseUrl}/api/push-to-github`,
      `${baseUrl}/api/symbi-chat`,
      `${baseUrl}/api/v0-chat`,
      `${baseUrl}/symbi/deploy`,
      `${baseUrl}/symbi/log`,
    ],
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  return NextResponse.json({
    message: "Webhook received successfully!",
    receivedData: body,
    timestamp: new Date().toISOString(),
  })
}
