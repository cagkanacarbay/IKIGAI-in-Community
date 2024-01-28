import { NextResponse, NextRequest } from "next/server";
import fs from 'fs';
import path from 'path';



export async function GET(_request: NextRequest): Promise<NextResponse> {
    try {
        // Define the file path
        const filePath = path.join(process.cwd(), 'ikigaiData', 'board-guide', 'v2.json');

        // Read the file
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Parse the JSON content
        const snapshot = JSON.parse(fileContent);

        // Return the snapshot
        return NextResponse.json(snapshot);
    } catch (error) {
        console.error('Failed to load snapshot:', error);
        return NextResponse.json({ error: 'Failed to load snapshot' }, { status: 500 });
    }
}
