/**
 * Vercel Serverless Function - SOLAPI 문자 발송 (REST API + HMAC-SHA256 인증)
 * 환경 변수: SOLAPI_API_KEY, SOLAPI_API_SECRET, SOLAPI_SENDER (발신번호)
 * @see https://developers.solapi.com/references/authentication
 */
import crypto from "crypto";

function generateSalt(length = 16) {
  return crypto.randomBytes(length).toString("hex").slice(0, 32);
}

function createSignature(date, salt, apiSecret) {
  const data = date + salt;
  return crypto.createHmac("sha256", apiSecret).update(data).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { phone, message } = req.body || {};
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  const sender = process.env.SOLAPI_SENDER;

  if (!phone || !message) {
    return res.status(400).json({
      success: false,
      error: "phone과 message가 필요합니다.",
    });
  }

  if (!apiKey || !apiSecret || !sender) {
    console.error("SOLAPI 환경 변수 미설정");
    return res.status(500).json({
      success: false,
      error:
        "문자 발송 설정이 완료되지 않았습니다. (SOLAPI_API_KEY, SOLAPI_API_SECRET, SOLAPI_SENDER)",
    });
  }

  try {
    const normalizedPhone = phone.replace(/-/g, "").replace(/\s/g, "");
    if (!/^01[0-9]{8,9}$/.test(normalizedPhone)) {
      return res.status(400).json({
        success: false,
        error: "올바른 휴대폰 번호 형식이 아닙니다.",
      });
    }

    // HMAC-SHA256 인증 헤더 생성
    const date = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
    const salt = generateSalt();
    const signature = createSignature(date, salt, apiSecret);
    const authHeader = `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;

    const body = {
      messages: [
        {
          to: normalizedPhone,
          from: sender.replace(/-/g, ""),
          text: message,
        },
      ],
    };

    const response = await fetch("https://api.solapi.com/messages/v4/send-many/detail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errMsg =
        data.errorMessage || data.statusMessage || data.message || `HTTP ${response.status}`;
      console.error("SOLAPI API 오류:", response.status, data);
      return res.status(response.status >= 500 ? 500 : 400).json({
        success: false,
        error: errMsg,
      });
    }

    if (data.failedMessageList && data.failedMessageList.length > 0) {
      const first = data.failedMessageList[0];
      const errMsg = first.statusMessage || first.statusCode || "메시지 발송 실패";
      console.error("SOLAPI 발송 실패:", data.failedMessageList);
      return res.status(500).json({
        success: false,
        error: errMsg,
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("SOLAPI 문자 발송 실패:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "문자 발송 중 오류가 발생했습니다.",
    });
  }
}
