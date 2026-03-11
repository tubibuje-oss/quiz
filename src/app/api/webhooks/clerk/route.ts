import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "../../../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    return new NextResponse("Missing signing secret", { status: 500 });
  }

  const payload = await req.text();
  const headerPayload = await headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };

  let evt: WebhookEvent;

  try {
    const wh = new Webhook(SIGNING_SECRET);
    evt = wh.verify(payload, svixHeaders) as WebhookEvent;
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  console.log("📩 Clerk event:", evt.type);

  // ✅ USER CREATED
  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    await prisma.user.create({
      data: {
        clerkId: id,
        email: email_addresses[0].email_address,
        name: first_name ? `${first_name} ${last_name ?? ""}`.trim() : null,
      },
    });

    console.log("✅ User created in Neon");
  }

  // ✅ USER UPDATED
  if (evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    await prisma.user.update({
      where: { clerkId: id },
      data: {
        email: email_addresses[0].email_address,
        name: first_name ? `${first_name} ${last_name ?? ""}`.trim() : null,
      },
    });

    console.log("✅ User updated in Neon");
  }

  // ✅ USER DELETED
  if (evt.type === "user.deleted") {
    const { id } = evt.data;

    if (id) {
      await prisma.user.delete({
        where: { clerkId: id },
      });
      console.log("✅ User deleted from Neon");
    }
  }

  return NextResponse.json({ success: true });
}
