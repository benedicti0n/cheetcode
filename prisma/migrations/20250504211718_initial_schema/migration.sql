-- CreateTable
CREATE TABLE "DSAQuestion" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_premium" BOOLEAN NOT NULL,
    "difficulty" TEXT NOT NULL,
    "acceptance_rate" DOUBLE PRECISION,
    "url" TEXT,
    "companies" TEXT[],
    "related_topics" TEXT[],
    "asked_by_faang" BOOLEAN NOT NULL,
    "similar_questions" TEXT[],

    CONSTRAINT "DSAQuestion_pkey" PRIMARY KEY ("id")
);
