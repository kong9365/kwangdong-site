/**
 * 예약 플로우 상태 관리
 * sessionStorage를 사용하여 예약 과정의 상태를 유지합니다.
 */

const STORAGE_KEY = "kwangdong_reservation_flow";

export interface ReservationFlowState {
  factory: string | null;
  agreementCompleted: boolean;
  agreementTimestamp: number | null;
  formStarted: boolean;
}

const DEFAULT_STATE: ReservationFlowState = {
  factory: null,
  agreementCompleted: false,
  agreementTimestamp: null,
  formStarted: false,
};

/**
 * 현재 예약 플로우 상태 조회
 */
export function getReservationFlowState(): ReservationFlowState {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_STATE;

    const state = JSON.parse(stored) as ReservationFlowState;

    // 동의 후 30분이 지났으면 만료 처리
    if (state.agreementTimestamp) {
      const elapsed = Date.now() - state.agreementTimestamp;
      const THIRTY_MINUTES = 30 * 60 * 1000;
      if (elapsed > THIRTY_MINUTES) {
        clearReservationFlowState();
        return DEFAULT_STATE;
      }
    }

    return state;
  } catch {
    return DEFAULT_STATE;
  }
}

/**
 * 공장 선택 저장
 */
export function setSelectedFactory(factory: string): void {
  const state = getReservationFlowState();
  state.factory = factory;
  saveState(state);
}

/**
 * 동의 완료 저장
 */
export function setAgreementCompleted(): void {
  const state = getReservationFlowState();
  state.agreementCompleted = true;
  state.agreementTimestamp = Date.now();
  saveState(state);
}

/**
 * 폼 시작 표시
 */
export function setFormStarted(): void {
  const state = getReservationFlowState();
  state.formStarted = true;
  saveState(state);
}

/**
 * 예약 플로우 상태 초기화
 */
export function clearReservationFlowState(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // sessionStorage 접근 실패 무시
  }
}

/**
 * 예약 플로우 유효성 검사
 * @returns 유효하면 null, 아니면 리다이렉트할 경로
 */
export function validateReservationFlow(): {
  isValid: boolean;
  redirectTo: string | null;
  message: string | null;
} {
  const state = getReservationFlowState();

  if (!state.factory) {
    return {
      isValid: false,
      redirectTo: "/",
      message: "공장 선택 정보가 없습니다. 방문예약 첫 화면으로 이동합니다.",
    };
  }

  if (!state.agreementCompleted) {
    return {
      isValid: false,
      redirectTo: "/reservation/agreement",
      message: "약관 동의가 필요합니다. 약관 동의 화면으로 이동합니다.",
    };
  }

  return {
    isValid: true,
    redirectTo: null,
    message: null,
  };
}

function saveState(state: ReservationFlowState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage 접근 실패 무시
  }
}
