-- CreateTable
CREATE TABLE "Permissions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "module" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "emailValidated" BOOLEAN NOT NULL DEFAULT false,
    "image" VARCHAR(255),
    "phone" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "codeValidation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Availabilities" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "start" DATE NOT NULL,
    "end" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requests" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "availabilityId" INTEGER NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staffs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "superStaff" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guests" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "codeQr" TEXT NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Speakers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ci" TEXT NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Speakers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "start" DATE NOT NULL,
    "end" DATE NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activities" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "start" DATE NOT NULL,
    "end" DATE NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceEvents" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "staffId" INTEGER NOT NULL,
    "guestId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttendanceEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceActivities" (
    "id" SERIAL NOT NULL,
    "activitiyId" INTEGER NOT NULL,
    "staffId" INTEGER NOT NULL,
    "guestId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttendanceActivities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "logo" VARCHAR(255) NOT NULL,
    "color" VARCHAR(255) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PermissionsToRoles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_codeValidation_key" ON "Users"("codeValidation");

-- CreateIndex
CREATE UNIQUE INDEX "Staffs_userId_key" ON "Staffs"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Guests_userId_key" ON "Guests"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Guests_codeQr_key" ON "Guests"("codeQr");

-- CreateIndex
CREATE UNIQUE INDEX "Speakers_userId_key" ON "Speakers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Speakers_ci_key" ON "Speakers"("ci");

-- CreateIndex
CREATE UNIQUE INDEX "Activities_name_key" ON "Activities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionsToRoles_AB_unique" ON "_PermissionsToRoles"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionsToRoles_B_index" ON "_PermissionsToRoles"("B");

-- AddForeignKey
ALTER TABLE "Availabilities" ADD CONSTRAINT "Availabilities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "Availabilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staffs" ADD CONSTRAINT "Staffs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staffs" ADD CONSTRAINT "Staffs_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guests" ADD CONSTRAINT "Guests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Speakers" ADD CONSTRAINT "Speakers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activities" ADD CONSTRAINT "Activities_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceEvents" ADD CONSTRAINT "AttendanceEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceEvents" ADD CONSTRAINT "AttendanceEvents_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceEvents" ADD CONSTRAINT "AttendanceEvents_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceActivities" ADD CONSTRAINT "AttendanceActivities_activitiyId_fkey" FOREIGN KEY ("activitiyId") REFERENCES "Activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceActivities" ADD CONSTRAINT "AttendanceActivities_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceActivities" ADD CONSTRAINT "AttendanceActivities_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionsToRoles" ADD CONSTRAINT "_PermissionsToRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "Permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionsToRoles" ADD CONSTRAINT "_PermissionsToRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
