"use server";

import { saveOrder, updateOrderStatus } from "@/lib/data-service";
import { revalidatePath } from "next/cache";

export async function createOrder(prevState, formData) {
    const rawData = {
        customerName: formData.get("customerName"),
        address: formData.get("address"),
        phone: formData.get("phone"),
        paymentMethod: formData.get("paymentMethod"),
        note: formData.get("note"),
        items: JSON.parse(formData.get("items")),
        total: parseFloat(formData.get("total")),
    };

    if (!rawData.items || rawData.items.length === 0) {
        return { message: "Cart is empty" };
    }

    try {
        await saveOrder(rawData);
        revalidatePath("/admin");
        return { message: "Order placed successfully!", success: true };
    } catch (error) {
        return { message: "Failed to place order" };
    }
}

export async function updateOrder(formData) {
    const orderId = formData.get("orderId");
    const status = formData.get("status");

    try {
        await updateOrderStatus(orderId, status);
        revalidatePath("/admin");
        revalidatePath("/account");
        return { message: "Order updated successfully" };
    } catch (error) {
        return { message: "Failed to update order" };
    }
}

export async function register(prevState, formData) {
    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        phone: formData.get("phone"),
        address: formData.get("address"),
    };

    try {
        const { registerUser } = await import("@/lib/data-service");
        const user = await registerUser(rawData);
        return { message: "Registration successful!", success: true, user };
    } catch (error) {
        return { message: error.message || "Registration failed" };
    }
}

export async function login(prevState, formData) {
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        const { loginUser } = await import("@/lib/data-service");
        const user = await loginUser(email, password);

        if (!user) {
            return { message: "Invalid email or password" };
        }

        return { message: "Login successful!", success: true, user };
    } catch (error) {
        return { message: "Login failed" };
    }
}

export async function createProduct(prevState, formData) {
    const rawData = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price")),
        largePrice: parseFloat(formData.get("largePrice")),
        category: formData.get("category"),
        image: formData.get("image"),
    };

    try {
        const { saveProduct } = await import("@/lib/data-service");
        const product = await saveProduct(rawData);
        revalidatePath("/drinks");
        revalidatePath("/admin");
        return { message: "Product added successfully!", success: true, product };
    } catch (error) {
        return { message: "Failed to add product" };
    }
}

export async function deleteProduct(formData) {
    const productId = formData.get("productId");

    try {
        const { deleteProduct: removeProduct } = await import("@/lib/data-service");
        await removeProduct(productId);
        revalidatePath("/drinks");
        revalidatePath("/admin");
        return { message: "Product deleted successfully", success: true };
    } catch (error) {
        return { message: "Failed to delete product" };
    }
}

export async function updateProduct(prevState, formData) {
    const productId = formData.get("productId");
    const rawData = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price")),
        largePrice: parseFloat(formData.get("largePrice")),
        category: formData.get("category"),
        image: formData.get("image"),
    };

    try {
        const { updateProduct: modifyProduct } = await import("@/lib/data-service");
        const product = await modifyProduct(productId, rawData);
        revalidatePath("/drinks");
        revalidatePath("/admin");
        return { message: "Product updated successfully!", success: true, product };
    } catch (error) {
        return { message: "Failed to update product" };
    }
}
