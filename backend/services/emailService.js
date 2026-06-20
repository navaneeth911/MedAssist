import net from "node:net";
import tls from "node:tls";

const requiredEnv = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"];

export const isEmailConfigured = () =>
  requiredEnv.every((key) => Boolean(process.env[key])) &&
  Boolean(process.env.SMTP_FROM || process.env.SMTP_USER);

const readLine = (socket) =>
  new Promise((resolve, reject) => {
    let buffer = "";

    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
    };

    const onError = (error) => {
      cleanup();
      reject(error);
    };

    const onData = (chunk) => {
      buffer += chunk.toString("utf8");
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      const lastLine = lines[lines.length - 1];

      if (lastLine && /^\d{3} /.test(lastLine)) {
        cleanup();
        resolve(buffer);
      }
    };

    socket.on("data", onData);
    socket.on("error", onError);
  });

const writeCommand = async (socket, command, expectedCodes) => {
  socket.write(`${command}\r\n`);
  const response = await readLine(socket);
  const code = Number(response.slice(0, 3));

  if (!expectedCodes.includes(code)) {
    throw new Error(`SMTP command failed: ${response.trim()}`);
  }

  return response;
};

const createSocket = () =>
  new Promise((resolve, reject) => {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const useSecure = String(process.env.SMTP_SECURE || "").toLowerCase() === "true" || port === 465;

    const socket = useSecure
      ? tls.connect(port, host, { servername: host }, () => resolve(socket))
      : net.connect(port, host, () => resolve(socket));

    socket.setTimeout(15000, () => {
      socket.destroy(new Error("SMTP connection timed out"));
    });
    socket.on("error", reject);
  });

export const sendEmail = async ({ to, subject, text }) => {
  if (!isEmailConfigured()) {
    throw new Error("Email is not configured on the server");
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const useSecure = String(process.env.SMTP_SECURE || "").toLowerCase() === "true" || port === 465;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  let socket = await createSocket();

  try {
    await readLine(socket);
    await writeCommand(socket, `EHLO ${host}`, [250]);

    if (!useSecure && String(process.env.SMTP_STARTTLS || "true").toLowerCase() !== "false") {
      await writeCommand(socket, "STARTTLS", [220]);
      socket = tls.connect({ socket, servername: host });
      await new Promise((resolve, reject) => {
        socket.once("secureConnect", resolve);
        socket.once("error", reject);
      });
      await writeCommand(socket, `EHLO ${host}`, [250]);
    }

    await writeCommand(socket, "AUTH LOGIN", [334]);
    await writeCommand(socket, Buffer.from(process.env.SMTP_USER).toString("base64"), [334]);
    await writeCommand(socket, Buffer.from(process.env.SMTP_PASS).toString("base64"), [235]);
    await writeCommand(socket, `MAIL FROM:<${from}>`, [250]);
    await writeCommand(socket, `RCPT TO:<${to}>`, [250, 251]);
    await writeCommand(socket, "DATA", [354]);

    const body = [
      `From: MedAssist AI <${from}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=utf-8",
      "",
      text,
      ".",
    ].join("\r\n");

    await writeCommand(socket, body, [250]);
    await writeCommand(socket, "QUIT", [221]);
  } finally {
    socket.end();
  }
};
