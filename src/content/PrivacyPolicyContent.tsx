/**
 * 광동제약㈜ 개인정보 처리방침 (공식 홈페이지 기준)
 * 방문예약 시스템용 수집 항목 추가 반영
 */
export function PrivacyPolicyContent() {
  return (
    <div className="text-sm space-y-4 text-foreground">
      <p>
        광동제약㈜(이하 &quot;회사&quot;라 한다)는 「개인정보 보호법」 제30조에 따라 이용자(정보주체)에게 개인정보 처리에 관한 절차 및 기준을 안내하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
      </p>

      <h3 className="font-bold mt-6">1. 개인정보 수집 항목 및 목적과 보유 기간</h3>
      <p>
        회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
      </p>
      <p>
        「개인정보 보호법」 제15조 제1항 제1호 및 제22조 제1항 제7호에 따라 정보주체의 동의를 받아 처리하고 있는 개인정보 항목은 다음과 같습니다.
      </p>
      <table className="w-full border-collapse border border-border mt-4">
        <thead>
          <tr className="bg-muted">
            <th className="border border-border p-2 text-left">구분</th>
            <th className="border border-border p-2 text-left">수집 목적</th>
            <th className="border border-border p-2 text-left">수집 항목</th>
            <th className="border border-border p-2 text-left">보유 및 이용기간</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-border p-2">방문자 예약정보시스템</td>
            <td className="border border-border p-2">방문예약 접수, 출입 관리, 안전·보안</td>
            <td className="border border-border p-2">성명, 연락처, 소속사명, 방문 이력(방문날짜, 장소 등)</td>
            <td className="border border-border p-2">최근 방문일 기준 방문 종료 후 1년간</td>
          </tr>
          <tr>
            <td className="border border-border p-2">고객 상담</td>
            <td className="border border-border p-2">상담, 문의 신청 접수 및 결과 통보</td>
            <td className="border border-border p-2">이름, 이메일주소, 연락처</td>
            <td className="border border-border p-2">3년 (전자상거래법 제6조)</td>
          </tr>
        </tbody>
      </table>
      <p>인터넷 서비스 이용과정에서 아래 개인정보 항목이 자동으로 생성되어 수집될 수 있습니다.</p>
      <p className="pl-4">- IP주소, 쿠키, 서비스 이용기록, 방문기록 등</p>

      <h3 className="font-bold mt-6">2. 개인정보의 제3자 제공</h3>
      <p>
        회사는 이용자(정보주체)의 개인정보를 개인정보의 처리 목적에서 명시한 범위 내에서만 처리하며, 이용자(정보주체)의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공하고 그 이외에는 이용자(정보주체)의 개인정보를 제3자에게 제공하지 않습니다.
      </p>
      <p>
        ① 회사는 원활한 서비스 제공을 위해 다음의 경우 이용자(정보주체)의 동의를 얻어 필요 최소한의 범위로만 제공합니다.
      </p>
      <table className="w-full border-collapse border border-border mt-4">
        <thead>
          <tr className="bg-muted">
            <th className="border border-border p-2 text-left">제공받는 자</th>
            <th className="border border-border p-2 text-left">제공목적</th>
            <th className="border border-border p-2 text-left">제공항목</th>
            <th className="border border-border p-2 text-left">보유 및 이용기간</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-border p-2">광동생활건강㈜</td>
            <td className="border border-border p-2">소비자 불만 또는 분쟁처리</td>
            <td className="border border-border p-2">이름, 이메일주소, 연락처</td>
            <td className="border border-border p-2">이용 목적 달성 시 까지. 단, 관련 법령에 따라 별도 보관이 필요한 경우 해당 기간 동안 보관</td>
          </tr>
        </tbody>
      </table>
      <p>※ 개인정보 3자제공이 필요한 경우에 한하여 이용자와의 전화 연결을 통해 개인정보 보호법 제17조 2항에 따른 항목을 고지하고 이용자에게 별도 동의를 얻습니다</p>

      <h3 className="font-bold mt-6">3. 개인정보처리의 위탁</h3>
      <p>① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</p>
      <table className="w-full border-collapse border border-border mt-4">
        <thead>
          <tr className="bg-muted">
            <th className="border border-border p-2 text-left">위탁받는 자 (수탁자)</th>
            <th className="border border-border p-2 text-left">위탁하는 업무의 내용</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-border p-2">바이더앱</td>
            <td className="border border-border p-2">홈페이지 개발 및 유지보수</td>
          </tr>
          <tr>
            <td className="border border-border p-2">㈜씨앤에이아이</td>
            <td className="border border-border p-2">온라인 문의 시스템 유지보수</td>
          </tr>
        </tbody>
      </table>
      <p>
        ② 회사는 위탁계약 체결 시 개인정보 보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.
      </p>
      <p>
        ③ 개인정보 보호법 제26조 제6항에 따라 수탁자가 당사의 개인정보 처리업무를 재위탁하는 경우 회사의 동의를 받고 있습니다.
      </p>
      <p>
        ④ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보 처리방침을 통하여 공개하도록 하겠습니다.
      </p>

      <h3 className="font-bold mt-6">4. 이용자(정보주체)의 권리·의무 및 행사방법</h3>
      <p>
        ① 이용자(정보주체)는 회사에 대해 언제든지 다음과 같이 개인정보 열람·정정·처리정지·삭제 및 동의철회/탈퇴를 요구할 권리를 행사할 수 있습니다.
      </p>
      <p className="pl-4">1. 개인정보 보호 담당조직 또는 개인정보 열람청구 접수처리 부서에 서면이나 전화 또는 전자우편(이메일)로 요청</p>
      <p>
        ② 제1항에 따른 권리 행사는 회사에 대해 서면, 전화, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다.
      </p>
      <p>
        ③ 제1항에 따른 권리 행사는 이용자(정보주체)의 위임을 받은 자 등 대리인을 통하여 하실 수도 있습니다. 이 경우 개인정보 처리 방법에 관한 고시 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.
      </p>
      <p>
        ④ 개인정보 열람 및 처리정지 요구는 개인정보 보호법 제35조 제4항, 제37조 제2항에 의하여 이용자(정보주체)의 권리가 제한될 수 있습니다.
      </p>
      <p>
        ⑤ 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.
      </p>
      <p>
        ⑥ 회사는 이용자(정보주체) 권리에 따른 열람의 요구, 정정·삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한 대리인인지를 확인합니다.
      </p>

      <h3 className="font-bold mt-6">5. 개인정보의 파기</h3>
      <p>
        ① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
      </p>
      <p>
        ② 이용자(정보주체)로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.
      </p>
      <p>
        ③ 개인정보 파기의 절차 및 방법은 다음과 같습니다.
      </p>
      <p className="pl-4">1. 파기 절차 : 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보의 이용 목적이 달성된 경우 지체없이 개인정보를 파기합니다.</p>
      <p className="pl-4">2. 파기 방법 : 회사는 전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.</p>

      <h3 className="font-bold mt-6">6. 개인정보의 안전성 확보조치</h3>
      <p>
        회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
      </p>
      <p className="pl-4">1. 관리적 조치 : 내부관리계획 수립 및 시행, 개인정보취급자 교육, 임직원에 대한 보안서약서 징구</p>
      <p className="pl-4">2. 기술적 조치 : 개인정보처리시스템 등의 접근권한 관리, 침입차단시스템 설치, 중요 개인정보 등의 전송 및 저장 시 암호화, 바이러스백신 등의 보안프로그램 설치, 접속기록의 보관 및 관리</p>
      <p className="pl-4">3. 물리적 조치 : 전산실 등의 접근통제</p>

      <h3 className="font-bold mt-6">7. 개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항</h3>
      <p>
        ① 회사는 이용자(정보주체)에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 &apos;쿠키(cookie)&apos;를 사용합니다.
      </p>
      <p>
        ② 쿠키는 웹사이트를 운영하는데 이용되는 서버가 이용자(정보주체)의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자(정보주체)의 컴퓨터내의 하드디스크에 저장됩니다.
      </p>
      <p className="pl-4">1. 쿠키의 사용목적 : 이용자(정보주체)가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태, 인기 검색어, 개인 맞춤 서비스, 로그인 상태 유지, 보안접속 여부 등을 파악하여 이용자(정보주체)에게 최적화된 정보 제공을 위해 사용됩니다.</p>
      <p className="pl-4">2. 쿠키의 설치·운영 및 거부 : Microsoft Edge, Chrome, Safari 등 브라우저 설정에서 쿠키 저장을 거부할 수 있습니다.</p>
      <p className="pl-4">3. 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.</p>

      <h3 className="font-bold mt-6">8. 개인정보 보호책임자</h3>
      <p>
        ① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자(정보주체)의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
      </p>
      <p>
        <strong>1. 개인정보 보호책임자</strong>
        <br />
        &nbsp;&nbsp;- 성명 : 정병기
        <br />
        &nbsp;&nbsp;- 소속 : CISO(상무)
        <br />
        &nbsp;&nbsp;- 연락처 : bkjung@ekdp.com
      </p>
      <p>
        <strong>2. 개인정보 보호 담당부서</strong>
        <br />
        &nbsp;&nbsp;- 성명 : 김수진
        <br />
        &nbsp;&nbsp;- 소속 : 정보보호팀(대리)
        <br />
        &nbsp;&nbsp;- 연락처 : 02-6006-7843, sj.kim@ekdp.com
      </p>
      <p>
        ② 이용자(정보주체)께서는 회사의 서비스(또는 사업)을 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다.
      </p>
      <p>
        <strong>3. 개인정보 열람청구 접수처리 부서</strong>
        <br />
        &nbsp;&nbsp;- 성명 : 차주엽
        <br />
        &nbsp;&nbsp;- 소속 : 소비자상담실
        <br />
        &nbsp;&nbsp;- 연락처 : 02-6006-7018, cornerz@ekdp.com
      </p>

      <h3 className="font-bold mt-6">9. 권익침해 구제방법</h3>
      <p>
        이용자(정보주체)는 아래의 기관을 통해 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다.
      </p>
      <p>
        &nbsp;1. 개인정보분쟁조정위원회 : (국번없이) 1833-6972 (<a href="https://www.kopico.go.kr" target="_blank" rel="noopener noreferrer" className="underline text-primary">www.kopico.go.kr</a>)
        <br />
        &nbsp;2. 개인정보침해신고센터 : (국번없이) 118 (<a href="https://privacy.kisa.or.kr" target="_blank" rel="noopener noreferrer" className="underline text-primary">privacy.kisa.or.kr</a>)
        <br />
        &nbsp;3. 대검찰청 : (국번없이) 1301 (<a href="https://www.spo.go.kr/" target="_blank" rel="noopener noreferrer" className="underline text-primary">www.spo.go.kr</a>)
        <br />
        &nbsp;4. 경찰청 : (국번없이) 182 (<a href="https://ecrm.cyber.go.kr" target="_blank" rel="noopener noreferrer" className="underline text-primary">ecrm.cyber.go.kr</a>)
      </p>

      <h3 className="font-bold mt-6">10. 개인정보 처리방침 변경</h3>
      <p>
        본 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우 변경사항의 시행 7일 전에 &apos;공지사항&apos;을 통해 사전 공지를 할 것입니다.
      </p>
      <p>
        ① 이 개인정보 처리방침은 2025년 12월 24일부터 적용됩니다.
      </p>
    </div>
  );
}
