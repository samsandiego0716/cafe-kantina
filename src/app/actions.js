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

    console.log('Server: updateOrder called with:', { orderId, status });

    try {
        await updateOrderStatus(orderId, status);
        console.log('Server: Order status updated successfully');
        revalidatePath("/admin");
        revalidatePath("/account");
        return { message: "Order updated successfully" };
    } catch (error) {
        console.error('Server: Error in updateOrder:', error);
        return { message: "Failed to update order", error: error.message };
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

export async function updateProfile(prevState, formData) {
    const userId = formData.get("userId");
    const name = formData.get("name");
    const phone = formData.get("phone");
    const address = formData.get("address");
    const imageBase64 = formData.get("imageBase64"); // Now receiving base64 string

    try {
        const { updateUser, uploadProfilePicture } = await import("@/lib/data-service");
        const { doc, getDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");

        const userData = { name, phone, address };

        // Handle profile picture upload if provided
        if (imageBase64 && imageBase64.length > 0) {
            try {
                const imageUrl = await uploadProfilePicture(userId, imageBase64);
                userData.image = imageUrl;
            } catch (uploadError) {
                console.error("Upload error:", uploadError);
                return {
                    message: `Failed to upload image: ${uploadError.code || uploadError.message}`
                };
            }
        }

        await updateUser(userId, userData);

        // Fetch the complete updated user data
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        const completeUserData = { id: userId, ...userDoc.data() };

        // Remove password from the returned data
        delete completeUserData.password;

        revalidatePath("/account");
        return { message: "Profile updated successfully!", success: true, userData: completeUserData };
    } catch (error) {
        console.error("Profile update error:", error);
        return { message: `Failed to update profile: ${error.message}` };
    }
}

export async function changeUserPassword(prevState, formData) {
    const userId = formData.get("userId");
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
        return { message: "Passwords do not match" };
    }

    try {
        const { changePassword } = await import("@/lib/data-service");

        // In production, you should verify the current password first
        // For now, we'll just update it
        await changePassword(userId, newPassword);
        revalidatePath("/account");
        return { message: "Password changed successfully!", success: true };
    } catch (error) {
        return { message: "Failed to change password" };
    }
}
