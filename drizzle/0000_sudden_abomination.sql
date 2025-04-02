CREATE TABLE `electricity_bill` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`homeId` integer,
	`amount` real,
	`date` text,
	FOREIGN KEY (`homeId`) REFERENCES `home`(`id`) ON UPDATE no action ON DELETE no action
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
