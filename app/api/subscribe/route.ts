import { NextResponse } from "next/server"

export async function POST(req:Request){

const body = await req.json()

console.log("Subscriber:",body.email)

return NextResponse.json({
success:true
})

}