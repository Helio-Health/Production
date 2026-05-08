export async function POST(request: Request) {
  try {
    const { doctorName, patientName, patientEmail, message } = await request.json()

    // Skip email if Resend isn't configured yet
    if (!process.env.RESEND_API_KEY) {
      console.log('Email skipped — no Resend key configured')
      console.log(`Match request: ${patientName} (${patientEmail}) → ${doctorName}`)
      return Response.json({ success: true })
    }

    // Resend email code goes here when ready

    return Response.json({ success: true })
  } catch (error) {
    console.error('Notify doctor error:', error)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}