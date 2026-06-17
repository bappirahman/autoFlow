-- disable transaction
ALTER TYPE "public"."node_type" ADD VALUE 'GEMINI';--> statement-breakpoint
ALTER TYPE "public"."webhook_provider" ADD VALUE 'stripe';
