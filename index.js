const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");

async function startClinicBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info");
    
    const sock = makeWASocket({
        logger: pino({ level: "silent" }),
        auth: state
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection } = update;
        if (connection === "open") {
            console.log("Shawaan Clinic Bot successfully connected to WhatsApp!");
        }
    });

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const m = messages[0];
        if (!m.message || m.key.fromMe) return;

        const messageType = Object.keys(m.message)[0];
        const body = messageType === "conversation" 
            ? m.message.conversation 
            : messageType === "extendedTextMessage" 
            ? m.message.extendedTextMessage.text 
            : "";

        const sender = m.key.remoteJid;
        const text = body.toLowerCase().trim();

        if (text === ".doctor" || text === ".info") {
            const clinicInfo = `
SHAWAAN TREATMENT CLINIC

Doctor Name: Dr. Muhammad Irfan
Specialization: Gurday ki Pathri Aur Masane ki Pathri ka Shawaan ke Zariye Ilaj
Details: Bina Operation Pathri ka Asan aur Asardaar Ilaj
Address: Sahiwal

Type .appointment to book your slot.
            `;
            await sock.sendMessage(sender, { text: clinicInfo }, { quoted: m });
        }
        else if (text === ".appointment") {
            const appointmentMsg = `
APPOINTMENT BOOKING

Please send your name and details to book your appointment slot with Dr. Muhammad Irfan. Clinic staff will contact you soon.
            `;
            await sock.sendMessage(sender, { text: appointmentMsg }, { quoted: m });
        }
    });
}

startClinicBot();
