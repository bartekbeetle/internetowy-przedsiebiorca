// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@repo/database";
import { createLessonNoteSchema } from "@/lib/validations";

// GET /api/courses/[slug]/lessons/[lessonId]/notes
export async function GET(
  _req: Request,
  { params }: { params: { slug: string; lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const note = await db.lessonNote.findUnique({
      where: {
        userId_lessonId: { userId, lessonId: params.lessonId },
      },
    });

    return NextResponse.json({
      content: note?.content || "",
      updatedAt: note?.updatedAt || null,
    });
  } catch (error) {
    console.error("GET lesson notes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[slug]/lessons/[lessonId]/notes
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string; lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const body = await req.json();
    const parsed = createLessonNoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Verify lesson exists and belongs to the course
    const lesson = await db.lesson.findUnique({
      where: { id: params.lessonId },
      select: {
        id: true,
        module: {
          select: {
            course: { select: { slug: true } },
          },
        },
      },
    });

    if (!lesson || lesson.module.course.slug !== params.slug) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const note = await db.lessonNote.upsert({
      where: {
        userId_lessonId: { userId, lessonId: params.lessonId },
      },
      create: {
        userId,
        lessonId: params.lessonId,
        content: parsed.data.content,
      },
      update: {
        content: parsed.data.content,
      },
    });

    return NextResponse.json({
      content: note.content,
      updatedAt: note.updatedAt,
    });
  } catch (error) {
    console.error("PUT lesson notes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
