import { supabase } from "@/integrations/supabase/client";

/**
 * 임직원모드 접근 권한 타입
 */
export type EmployeePermission = 'approve' | 'checkin' | 'admin';

/**
 * 사용자의 임직원모드 권한 정보
 */
export interface EmployeePermissions {
  can_approve: boolean;
  can_checkin: boolean;
  can_admin: boolean;
}

/**
 * 특정 권한이 있는지 확인
 * @param userId 사용자 ID
 * @param permission 확인할 권한
 * @returns 권한 여부
 */
export async function checkEmployeePermission(
  userId: string,
  permission: EmployeePermission
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('employee_permissions')
      .select(`can_${permission}`)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('권한 확인 오류:', error);
      return false;
    }

    return data?.[`can_${permission}`] || false;
  } catch (error) {
    console.error('권한 확인 중 예외 발생:', error);
    return false;
  }
}

/**
 * 사용자의 모든 임직원모드 권한 조회
 * @param userId 사용자 ID
 * @returns 권한 정보 객체
 */
export async function getEmployeePermissions(
  userId: string
): Promise<EmployeePermissions | null> {
  try {
    const { data, error } = await supabase
      .from('employee_permissions')
      .select('can_approve, can_checkin, can_admin')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 데이터가 없음 (권한 없음)
        return {
          can_approve: false,
          can_checkin: false,
          can_admin: false,
        };
      }
      console.error('권한 조회 오류:', error);
      return null;
    }

    return {
      can_approve: data?.can_approve || false,
      can_checkin: data?.can_checkin || false,
      can_admin: data?.can_admin || false,
    };
  } catch (error) {
    console.error('권한 조회 중 예외 발생:', error);
    return null;
  }
}

/**
 * 현재 로그인한 사용자의 권한 확인
 * @param permission 확인할 권한
 * @returns 권한 여부
 */
export async function checkCurrentUserPermission(
  permission: EmployeePermission
): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    return await checkEmployeePermission(user.id, permission);
  } catch (error) {
    console.error('현재 사용자 권한 확인 중 예외 발생:', error);
    return false;
  }
}

/**
 * 현재 로그인한 사용자의 모든 권한 조회
 * @returns 권한 정보 객체
 */
export async function getCurrentUserPermissions(): Promise<EmployeePermissions | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    return await getEmployeePermissions(user.id);
  } catch (error) {
    console.error('현재 사용자 권한 조회 중 예외 발생:', error);
    return null;
  }
}

