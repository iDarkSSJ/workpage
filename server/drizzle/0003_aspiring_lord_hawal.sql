ALTER TABLE "review" ADD COLUMN "reviewee_role" text NOT NULL;--> statement-breakpoint
CREATE INDEX "review_reviewee_role_idx" ON "review" USING btree ("reviewee_id","reviewee_role");