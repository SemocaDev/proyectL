CREATE TYPE "public"."link_mode" AS ENUM('redirect', 'linkhub');--> statement-breakpoint
CREATE TYPE "public"."link_status" AS ENUM('active', 'disabled', 'flagged');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('pending', 'resolved', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "accounts" (
	"user_id" uuid NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "link_clicks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"link_id" uuid NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"ip_hash" varchar(64),
	"session_id" varchar(64),
	"is_bot" boolean DEFAULT false,
	"country" varchar(2),
	"city" varchar(100),
	"region" varchar(100),
	"referer" text,
	"user_agent" text,
	"language" varchar(10),
	"device_type" varchar(20),
	"browser_name" varchar(50),
	"os_name" varchar(50),
	"screen_width" integer,
	"screen_height" integer,
	"timezone" varchar(50),
	"connection_type" varchar(20),
	"link_button_index" integer,
	"duration" integer,
	"utm_source" varchar(100),
	"utm_medium" varchar(100),
	"utm_campaign" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"description" text,
	"resource" varchar(50) NOT NULL,
	"action" varchar(50) NOT NULL,
	"scope" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limit_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(255) NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"window_start" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"link_id" uuid NOT NULL,
	"reported_by" uuid,
	"reason" text NOT NULL,
	"status" "report_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role" "user_role" NOT NULL,
	"permission_id" varchar(50) NOT NULL,
	CONSTRAINT "role_permissions_role_permission_id_pk" PRIMARY KEY("role","permission_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "short_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"short_code" varchar(12) NOT NULL,
	"owner_id" uuid NOT NULL,
	"mode" "link_mode" DEFAULT 'redirect' NOT NULL,
	"target_url" text,
	"landing_data" jsonb,
	"title" varchar(100),
	"description" varchar(300),
	"tags" text[],
	"custom_alias" varchar(50),
	"password_hash" varchar(255),
	"click_limit" integer,
	"click_count" integer DEFAULT 0 NOT NULL,
	"status" "link_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "short_links_short_code_unique" UNIQUE("short_code")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp,
	"image" text,
	"role" "user_role" DEFAULT 'USER' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link_clicks" ADD CONSTRAINT "link_clicks_link_id_short_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."short_links"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_link_id_short_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."short_links"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reported_by_users_id_fk" FOREIGN KEY ("reported_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "short_links" ADD CONSTRAINT "short_links_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "link_clicks_link_id_idx" ON "link_clicks" USING btree ("link_id");--> statement-breakpoint
CREATE INDEX "link_clicks_timestamp_idx" ON "link_clicks" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "link_clicks_link_id_timestamp_idx" ON "link_clicks" USING btree ("link_id","timestamp");--> statement-breakpoint
CREATE INDEX "link_clicks_country_idx" ON "link_clicks" USING btree ("country");--> statement-breakpoint
CREATE INDEX "link_clicks_session_id_idx" ON "link_clicks" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "rate_limit_key_idx" ON "rate_limit_entries" USING btree ("key");--> statement-breakpoint
CREATE INDEX "rate_limit_expires_idx" ON "rate_limit_entries" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "reports_link_id_idx" ON "reports" USING btree ("link_id");--> statement-breakpoint
CREATE INDEX "reports_status_idx" ON "reports" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "short_links_short_code_idx" ON "short_links" USING btree ("short_code");--> statement-breakpoint
CREATE INDEX "short_links_owner_id_idx" ON "short_links" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "short_links_status_idx" ON "short_links" USING btree ("status");--> statement-breakpoint
CREATE INDEX "short_links_custom_alias_idx" ON "short_links" USING btree ("custom_alias");