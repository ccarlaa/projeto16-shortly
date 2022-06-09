CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL
);

CREATE TABLE "keys" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES users(id),
    "token" TEXT UNIQUE NOT NULL
);

CREATE TABLE "urls" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES users(id),
    "url" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL
);