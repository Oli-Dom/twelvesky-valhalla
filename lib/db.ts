import mysql from "mysql2/promise"
import { NextResponse } from "next/server"

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Helper function to execute SQL queries
export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// User-related database functions
export async function getUserByEmail(email: string) {
  const users = (await query("SELECT * FROM memberinfo WHERE uEmail = ?", [email])) as any[]
  return users.length > 0 ? users[0] : null
}

export async function getUserById(id: string | number) {
  const users = (await query("SELECT * FROM memberinfo WHERE uID = ?", [id])) as any[]
  return users.length > 0 ? users[0] : null
}

export async function getUserByUsername(username: string) {
  const users = (await query("SELECT * FROM memberinfo WHERE uID = ?", [username])) as any[]
  return users.length > 0 ? users[0] : null
}

export async function createUser(username: string, email: string, password: string, isVerified:number) {
  const result = (await query("INSERT INTO memberinfo (uID, uEmail, uPassword, isVerified) VALUES (?, ?, ?,?)", [
    username,
    email,
    password,
    isVerified
  ])) as any

  if (result.insertId) {
    return {
      id: result.insertId,
      uID: username,
      uEmail: email,
      isVerified: isVerified
    }
  }

  return null
}

// Get user's helix coins
export async function getUserHelixCoins(userId: string | number) {
  const result = (await query("SELECT uCash FROM memberinfo WHERE uEmail = ?", [userId])) as any[]

  if (result.length > 0) {
    return result[0].uCash
  }

  // If no record exists, create one with 0 coins
  await query("INSERT INTO memberinfo (uEmail, uCash) VALUES (?, 0)", [userId])
  return 0
}

// Update user's helix coins
export async function updateUserHelixCoins(uEmail: string | number, amount: number) {
  // Check if user has a record
  const existing = (await query("SELECT uID FROM memberinfo WHERE uEmail = ?", [uEmail])) as any[]

  if (existing.length > 0) {
    await query("UPDATE memberinfo SET uCash = uCash + ? WHERE uEmail = ?", [amount, uEmail])
  } else {
    await query("INSERT INTO memberinfo (uEmail, uCash) VALUES (?, ?)", [uEmail, amount])
  }

  // Return updated amount
  const updated = (await query("SELECT uCash FROM memberinfo WHERE uEmail = ?", [uEmail])) as any[]
  return updated[0].helixCoins
}

export async function storeVerificationToken(uEmail:string, token:string){
    const existing = (await query("SELECT uID FROM memberinfo WHERE uEmail = ?", [uEmail])) as any[]
 if (existing.length > 0) {
    await query("UPDATE memberinfo SET verificationToken = ? WHERE uEmail = ?", [token, uEmail])
  } else {
    return NextResponse.json({ error: 'No account to bind token to' }, { status: 500 })
  }
}

export async function getVerificationStatus(token: string) {
  const existing = (await query("SELECT * FROM memberinfo WHERE verificationToken = ?", [token])) as any[]

  if (existing.length > 0) {
    return {
      uEmail: existing[0].uEmail,
      status: existing[0].isVerified,
    }
  } else {
    return null
  }
}

export async function markEmailAsVerified(uEmail: string) {
  await query("UPDATE memberinfo SET isVerified = 1 WHERE uEmail = ?", [uEmail])
}
