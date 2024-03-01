CREATE TABLE `images` (
	`id` text PRIMARY KEY NOT NULL,
	`tags` text,
	`is_nsfw` integer,
	`width` integer,
	`height` integer,
	`source` text,
	`uploaded_at` text DEFAULT datetime('now', 'localtime'),
	`file_extension` text,
	`url` text,
	`ip` text
);
