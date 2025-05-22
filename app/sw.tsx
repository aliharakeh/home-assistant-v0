import { NextResponse } from "next/server"
import generateServiceWorker from "./sw"

export function GET() {
  const serviceWorkerContent = generateServiceWorker()
  return new NextResponse(serviceWorkerContent, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  })
}
