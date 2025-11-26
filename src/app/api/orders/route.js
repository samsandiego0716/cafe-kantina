import { getOrders } from "@/lib/data-service";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    const orders = await getOrders();

    if (phone) {
        const userOrders = orders.filter((order) => order.phone === phone);
        return NextResponse.json(userOrders);
    }

    // Admin access (simplified: returns all orders if no phone provided, 
    // in real app would check auth)
    return NextResponse.json(orders);
}
