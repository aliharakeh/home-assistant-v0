CREATE TABLE `electricity_bill` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`homeId` integer,
	`date` text,
	`amount` real,
	`subsription_type` text,
	FOREIGN KEY (`homeId`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `home` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`address` text,
	`electricity` text,
	`shareholders` text,
	`rent` text
);
