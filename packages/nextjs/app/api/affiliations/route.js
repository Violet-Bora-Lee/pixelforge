// Just hardcode bored apes for now

export async function GET(request) {
  return NextResponse.json({ affiliations: ["bored_apes"] });
}
