CREATE TABLE `photos` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`location` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`object_key` text NOT NULL,
	`content_type` text NOT NULL,
	`items` text NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_photos_owner_created` ON `photos` (`owner`,`created_at`);
