CREATE TYPE "public"."webhook_provider" AS ENUM('google_form');--> statement-breakpoint
ALTER TYPE "public"."node_type" ADD VALUE 'STRIPE_TRIGGER';--> statement-breakpoint
ALTER TABLE "webhook" ADD COLUMN "node_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "webhook" ADD COLUMN "provider" "webhook_provider" NOT NULL;--> statement-breakpoint
ALTER TABLE "webhook" ADD CONSTRAINT "webhook_node_id_node_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."node"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook" ADD CONSTRAINT "webhook_node_id_unique" UNIQUE("node_id");