// ============================================================================
// FORMATTERS & VIETNAMESE LOCALIZATION UTILITIES (CORE-015)
// Timezone: Asia/Ho_Chi_Minh | Date format: dd/MM/yyyy | 24-hour time
// ============================================================================

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDateVN(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
      // If it's already YYYY-MM-DD
      const parts = dateString.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      return dateString;
    }
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
}

export function formatDateTimeVN(dateTimeString?: string): string {
  if (!dateTimeString) return '-';
  try {
    const d = new Date(dateTimeString);
    if (isNaN(d.getTime())) return dateTimeString;
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${hours}:${minutes} ngày ${day}/${month}/${year}`;
  } catch {
    return dateTimeString;
  }
}

export function getGenderLabel(gender: 'MALE' | 'FEMALE' | 'OTHER'): string {
  if (gender === 'MALE') return 'Nam';
  if (gender === 'FEMALE') return 'Nữ';
  return 'Khác';
}

export function getAttendanceStatusBadge(status: string): { label: string; bg: string; text: string } {
  switch (status) {
    case 'PRESENT':
      return { label: 'Có mặt', bg: 'bg-emerald-100', text: 'text-emerald-800' };
    case 'ABSENT_EXCUSED':
      return { label: 'Vắng có phép', bg: 'bg-amber-100', text: 'text-amber-800' };
    case 'ABSENT_UNEXCUSED':
      return { label: 'Vắng không phép', bg: 'bg-rose-100', text: 'text-rose-800' };
    case 'LATE':
      return { label: 'Đi muộn', bg: 'bg-orange-100', text: 'text-orange-800' };
    case 'EARLY_LEAVE':
      return { label: 'Về sớm', bg: 'bg-yellow-100', text: 'text-yellow-800' };
    case 'MEDICAL':
      return { label: 'Nghỉ ốm', bg: 'bg-purple-100', text: 'text-purple-800' };
    default:
      return { label: status, bg: 'bg-slate-100', text: 'text-slate-800' };
  }
}
