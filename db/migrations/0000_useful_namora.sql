CREATE TABLE IF NOT EXISTS "conversions" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"original_filename" text NOT NULL,
	"filesize" integer NOT NULL,
	"conversion_type" text NOT NULL,
	"output_path" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" integer,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversions" ADD CONSTRAINT "conversions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
