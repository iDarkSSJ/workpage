CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contractor_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"company_name" text,
	"bio" text,
	"country" text,
	"website_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "contractor_profile_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "freelancer_certification" (
	"id" text PRIMARY KEY NOT NULL,
	"freelancer_id" text NOT NULL,
	"name" text NOT NULL,
	"institution" text NOT NULL,
	"issued_date" timestamp NOT NULL,
	"url" text
);
--> statement-breakpoint
CREATE TABLE "freelancer_experience" (
	"id" text PRIMARY KEY NOT NULL,
	"freelancer_id" text NOT NULL,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"description" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "freelancer_portfolio" (
	"id" text PRIMARY KEY NOT NULL,
	"freelancer_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text,
	"project_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "freelancer_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"bio" text,
	"category" text,
	"hourly_rate" numeric(10, 2),
	"country" text,
	"linkedin_url" text,
	"github_url" text,
	"website_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "freelancer_profile_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "freelancer_skill" (
	"freelancer_id" text NOT NULL,
	"skill_id" text NOT NULL,
	CONSTRAINT "freelancer_skill_freelancer_id_skill_id_pk" PRIMARY KEY("freelancer_id","skill_id")
);
--> statement-breakpoint
CREATE TABLE "skill" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	CONSTRAINT "skill_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "contract" (
	"id" text PRIMARY KEY NOT NULL,
	"proposal_id" text NOT NULL,
	"project_id" text NOT NULL,
	"contractor_id" text NOT NULL,
	"freelancer_id" text NOT NULL,
	"agreed_amount" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	CONSTRAINT "contract_proposal_id_unique" UNIQUE("proposal_id")
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"contractor_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"budget_type" text NOT NULL,
	"budget_min" numeric(10, 2),
	"budget_max" numeric(10, 2),
	"status" text DEFAULT 'open' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_skill" (
	"project_id" text NOT NULL,
	"skill_id" text NOT NULL,
	CONSTRAINT "project_skill_project_id_skill_id_pk" PRIMARY KEY("project_id","skill_id")
);
--> statement-breakpoint
CREATE TABLE "proposal" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"freelancer_id" text NOT NULL,
	"cover_letter" text NOT NULL,
	"bid_amount" numeric(10, 2) NOT NULL,
	"bid_type" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "proposal_unique" UNIQUE("project_id","freelancer_id")
);
--> statement-breakpoint
CREATE TABLE "review" (
	"id" text PRIMARY KEY NOT NULL,
	"contract_id" text NOT NULL,
	"reviewer_id" text NOT NULL,
	"reviewee_id" text NOT NULL,
	"reviewee_role" text NOT NULL,
	"rating" numeric(3, 2) NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "review_unique" UNIQUE("contract_id","reviewer_id")
);
--> statement-breakpoint
CREATE TABLE "conversation" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text,
	"participant_a_id" text NOT NULL,
	"participant_b_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "conversation_unique" UNIQUE("project_id","participant_a_id","participant_b_id")
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" text PRIMARY KEY NOT NULL,
	"conversation_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"content" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contractor_profile" ADD CONSTRAINT "contractor_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "freelancer_certification" ADD CONSTRAINT "freelancer_certification_freelancer_id_freelancer_profile_id_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."freelancer_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "freelancer_experience" ADD CONSTRAINT "freelancer_experience_freelancer_id_freelancer_profile_id_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."freelancer_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "freelancer_portfolio" ADD CONSTRAINT "freelancer_portfolio_freelancer_id_freelancer_profile_id_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."freelancer_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "freelancer_profile" ADD CONSTRAINT "freelancer_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "freelancer_skill" ADD CONSTRAINT "freelancer_skill_freelancer_id_freelancer_profile_id_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."freelancer_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "freelancer_skill" ADD CONSTRAINT "freelancer_skill_skill_id_skill_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skill"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract" ADD CONSTRAINT "contract_proposal_id_proposal_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."proposal"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract" ADD CONSTRAINT "contract_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract" ADD CONSTRAINT "contract_contractor_id_contractor_profile_id_fk" FOREIGN KEY ("contractor_id") REFERENCES "public"."contractor_profile"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract" ADD CONSTRAINT "contract_freelancer_id_freelancer_profile_id_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."freelancer_profile"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_contractor_id_contractor_profile_id_fk" FOREIGN KEY ("contractor_id") REFERENCES "public"."contractor_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_skill" ADD CONSTRAINT "project_skill_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_skill" ADD CONSTRAINT "project_skill_skill_id_skill_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skill"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_freelancer_id_freelancer_profile_id_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."freelancer_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_contract_id_contract_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contract"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_reviewer_id_user_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_reviewee_id_user_id_fk" FOREIGN KEY ("reviewee_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_participant_a_id_user_id_fk" FOREIGN KEY ("participant_a_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_participant_b_id_user_id_fk" FOREIGN KEY ("participant_b_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "certification_freelancer_idx" ON "freelancer_certification" USING btree ("freelancer_id");--> statement-breakpoint
CREATE INDEX "experience_freelancer_idx" ON "freelancer_experience" USING btree ("freelancer_id");--> statement-breakpoint
CREATE INDEX "freelancer_portfolio_freelancer_id_idx" ON "freelancer_portfolio" USING btree ("freelancer_id");--> statement-breakpoint
CREATE INDEX "contract_contractor_idx" ON "contract" USING btree ("contractor_id");--> statement-breakpoint
CREATE INDEX "contract_freelancer_idx" ON "contract" USING btree ("freelancer_id");--> statement-breakpoint
CREATE INDEX "project_contractor_idx" ON "project" USING btree ("contractor_id");--> statement-breakpoint
CREATE INDEX "project_status_idx" ON "project" USING btree ("status");--> statement-breakpoint
CREATE INDEX "proposal_project_idx" ON "proposal" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "proposal_freelancer_idx" ON "proposal" USING btree ("freelancer_id");--> statement-breakpoint
CREATE INDEX "review_reviewee_idx" ON "review" USING btree ("reviewee_id");--> statement-breakpoint
CREATE INDEX "conversation_participant_a_idx" ON "conversation" USING btree ("participant_a_id");--> statement-breakpoint
CREATE INDEX "conversation_participant_b_idx" ON "conversation" USING btree ("participant_b_id");--> statement-breakpoint
CREATE INDEX "message_conversation_idx" ON "message" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "message_sender_idx" ON "message" USING btree ("sender_id");