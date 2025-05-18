// hash-password.ts (nur lokal ausführen!)
import bcrypt from "bcryptjs";

const password = "wadehn.mallorca"; // dein gewünschtes Passwort
const saltRounds = 10;

const hash = bcrypt.hashSync(password, saltRounds);
console.log("🔐 Gehashter Passwort-Hash:", hash);
