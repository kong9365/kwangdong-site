/**
 * Vercel Serverless Function - SOLAPI 문자 발송
 * 환경 변수: SOLAPI_API_KEY, SOLAPI_API_SECRET, SOLAPI_SENDER (발신번호)
 */
import { SolapiMessageService } from 'solapi';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { phone, message } = req.body || {};
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  const sender = process.env.SOLAPI_SENDER;

  if (!phone || !message) {
    return res.status(400).json({
      success: false,
      error: 'phone과 message가 필요합니다.',
    });
  }

  if (!apiKey || !apiSecret || !sender) {
    console.error('SOLAPI 환경 변수 미설정');
    return res.status(500).json({
      success: false,
      error: '문자 발송 설정이 완료되지 않았습니다. (SOLAPI_API_KEY, SOLAPI_API_SECRET, SOLAPI_SENDER)',
    });
  }

  try {
    // 전화번호 정규화 (하이픈 제거, 01012345678 형식)
    const normalizedPhone = phone.replace(/-/g, '').replace(/\s/g, '');
    if (!/^01[0-9]{8,9}$/.test(normalizedPhone)) {
      return res.status(400).json({
        success: false,
        error: '올바른 휴대폰 번호 형식이 아닙니다.',
      });
    }

    const messageService = new SolapiMessageService(apiKey, apiSecret);

    await messageService.send({
      to: normalizedPhone,
      from: sender,
      text: message,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('SOLAPI 문자 발송 실패:', error);
    return res.status(500).json({
      success: false,
      error: error.message || '문자 발송 중 오류가 발생했습니다.',
    });
  }
}
