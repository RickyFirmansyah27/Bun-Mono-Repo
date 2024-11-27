# db-migration

## How to create migration?

pastikan anda sudah membuat database baru sebelum menjalankan migrasi, karena command ini akan menyinkronkan database lokal mu dengan file migrasi. Jika kamu menggunakan database existing, waspada data tabel mu terhapus

buat table baru dengan

```sh
    CREATE DATABASE kiwkiw
```

jika sudah berhasil buat, kita lanjut

mau menyinkronkan database?

```sh
    bun run migrate:up
```

mau reset database?

```sh
    bun run migrate:down
```

mau bikin migrasi?

1. open `schema.prisma` file, its located inside `prisma` directory
2. add/update/delete schema or table inside this file
3. run `bun run migrate:create [migration-name]`
