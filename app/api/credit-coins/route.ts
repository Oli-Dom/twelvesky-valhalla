
import { updateUserHelixCoins } from "@/lib/db"
import { NextResponse } from "next/server"
export async function POST(req: Request) {

    try{
    
     
        const body = await req.json()
        console.log("Request body:", body)
        const { userId, coins } = body
    
       const newBalance = updateUserHelixCoins(userId, coins)

       return NextResponse.json(
        {
            message: "Helix coins updated successfully",
            newBalance: newBalance,
        },
        { status: 200 },
       )
    }catch (error) {
        console.error("Error updating Helix coins:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        )
    }
   
}