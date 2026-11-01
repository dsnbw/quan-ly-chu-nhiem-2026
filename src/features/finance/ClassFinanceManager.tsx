import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Download,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  RotateCcw,
  Receipt
} from 'lucide-react';
import { localStore } from '../../core/storage/localStore';
import { FinancialCampaign, FinancialTransaction, StudentFeeEntry } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { StatCard } from '../../components/common/StatCard';
import { formatVND, formatDateVN, formatDateTimeVN } from '../../utils/formatters';
import { ExcelService } from '../../core/export/excelExport';

export const ClassFinanceManager: React.FC = () => {
  const classes = localStore.getClasses();
  const currentClass = classes[0] || { id: 'class-default', name: 'Lớp 8A1', code: '8A1' };
  const [campaigns, setCampaigns] = useState<FinancialCampaign[]>(localStore.getFinancialCampaigns());
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(localStore.getFinancialTransactions());
  const [fees, setFees] = useState<StudentFeeEntry[]>(localStore.getStudentFees());
  const [activeTab, setActiveTab] = useState<'matrix' | 'ledger' | 'campaigns'>('matrix');

  const [categories, setCategories] = useState<{income: string[], expense: string[]}>(() => {
    const saved = localStorage.getItem('cva_financial_categories');
    return saved ? JSON.parse(saved) : {
      income: ['Đóng góp Quỹ lớp', 'Tài trợ & Ủng hộ', 'Lãi phát sinh'],
      expense: ['Văn phòng phẩm & Trang trí', 'Nước uống & Vệ sinh lớp', 'Khen thưởng phong trào', 'Hoạt động ngoại khóa & Trải nghiệm', 'Liên hoan tập thể']
    };
  });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryType, setCategoryType] = useState<'income' | 'expense'>('expense');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // New Transaction Modal State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState<number>(100000);
  const [expenseCategory, setExpenseCategory] = useState(categories.expense[0] || '');
  const [expensePayee, setExpensePayee] = useState('');
  const [expenseReceiptNo, setExpenseReceiptNo] = useState('');

  // Quick Income Modal State
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [incomeStudentId, setIncomeStudentId] = useState('');
  const [incomeAmount, setIncomeAmount] = useState<number>(200000);
  const [incomeCategory, setIncomeCategory] = useState(categories.income[0] || '');
  const [incomeMethod, setIncomeMethod] = useState<'CASH' | 'BANK_TRANSFER'>('BANK_TRANSFER');

  // Compute calculated balance (FIN-004: OpeningBalance + Income - Expense + Adjustments)
  const totalIncome = transactions.filter(t => t.type === 'INCOME' && t.status === 'POSTED').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE' && t.status === 'POSTED').reduce((s, t) => s + t.amount, 0);
  const totalAdjustments = transactions.filter(t => (t.type === 'ADJUSTMENT' || t.type === 'REVERSAL') && t.status === 'POSTED').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense + totalAdjustments;

  const handleRecordExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || expenseAmount <= 0) return;

    const session = localStore.getUserSession();
    const newTx: FinancialTransaction = {
      id: 'tx-' + Math.random().toString(36).substring(2, 9),
      classId: currentClass.id,
      campaignId: campaigns[0]?.id,
      type: 'EXPENSE',
      category: expenseCategory,
      title: expenseTitle,
      amount: Number(expenseAmount),
      occurredAt: new Date().toISOString(),
      recordedAt: new Date().toISOString(),
      paymentMethod: 'CASH',
      payerOrPayee: expensePayee || 'Cửa hàng cung cấp dịch vụ',
      referenceNo: expenseReceiptNo || 'HĐ-VPP',
      recordedByTeacherName: session.fullName,
      status: 'POSTED'
    };

    localStore.addFinancialTransaction(newTx);
    setTransactions(localStore.getFinancialTransactions());
    setIsExpenseModalOpen(false);
    setExpenseTitle('');
  };

  const handleRecordIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeStudentId || incomeAmount <= 0) return;

    const student = localStore.getStudents().find(s => s.id === incomeStudentId);
    if (!student) return;

    const session = localStore.getUserSession();
    const newTx: FinancialTransaction = {
      id: 'tx-' + Math.random().toString(36).substring(2, 9),
      classId: currentClass.id,
      campaignId: campaigns[0]?.id,
      studentId: student.id,
      studentName: student.fullName,
      type: 'INCOME',
      category: incomeCategory,
      title: `Thu ${incomeCategory} (${student.fullName})`,
      amount: Number(incomeAmount),
      occurredAt: new Date().toISOString(),
      recordedAt: new Date().toISOString(),
      paymentMethod: incomeMethod,
      payerOrPayee: student.guardians[0]?.fullName || student.fullName,
      referenceNo: incomeMethod === 'BANK_TRANSFER' ? 'FT' + Date.now().toString().slice(-6) : 'PT-' + Math.floor(Math.random() * 100),
      recordedByTeacherName: session.fullName,
      status: 'POSTED'
    };

    localStore.addFinancialTransaction(newTx);
    setTransactions(localStore.getFinancialTransactions());
    setFees(localStore.getStudentFees());
    setIsIncomeModalOpen(false);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    if (categories[categoryType].includes(newCategoryName.trim())) {
      alert('Danh mục này đã tồn tại!');
      return;
    }
    const updated = {
      ...categories,
      [categoryType]: [...categories[categoryType], newCategoryName.trim()]
    };
    setCategories(updated);
    localStorage.setItem('cva_financial_categories', JSON.stringify(updated));
    setNewCategoryName('');
  };

  const handleDeleteCategory = (cat: string) => {
    const isUsed = transactions.some(t => t.category === cat);
    if (isUsed) {
      alert('Không thể xóa! Danh mục này đã được sử dụng trong các giao dịch thu/chi.');
      return;
    }
    if (confirm(`Xóa danh mục "${cat}"?`)) {
      const updated = {
        ...categories,
        [categoryType]: categories[categoryType].filter(c => c !== cat)
      };
      setCategories(updated);
      localStorage.setItem('cva_financial_categories', JSON.stringify(updated));
      if (categoryType === 'expense' && expenseCategory === cat) {
        setExpenseCategory(updated.expense[0] || '');
      }
    }
  };

  const handleSaveEditCategory = (oldCat: string) => {
    if (!editCategoryName.trim()) return;
    if (oldCat === editCategoryName.trim()) {
      setEditingCategory(null);
      return;
    }
    if (categories[categoryType].includes(editCategoryName.trim())) {
      alert('Tên danh mục này đã tồn tại!');
      return;
    }

    // Update categories
    const updated = {
      ...categories,
      [categoryType]: categories[categoryType].map(c => c === oldCat ? editCategoryName.trim() : c)
    };
    setCategories(updated);
    localStorage.setItem('cva_financial_categories', JSON.stringify(updated));

    if (categoryType === 'expense' && expenseCategory === oldCat) {
      setExpenseCategory(editCategoryName.trim());
    }

    // Update transactions bulk
    const list = localStore.getFinancialTransactions();
    let updatedTxs = false;
    list.forEach(t => {
      if (t.category === oldCat && t.type === (categoryType === 'income' ? 'INCOME' : 'EXPENSE')) {
        t.category = editCategoryName.trim();
        updatedTxs = true;
        // Optional: record mutation if sync supports bulk PATCH
        // localStore.recordMutation('financial_transaction', t.id, 'PATCH', { category: editCategoryName.trim() });
      }
    });

    if (updatedTxs) {
      localStore.saveFinancialTransactions(list);
      setTransactions(list);
    }

    setEditingCategory(null);
  };

  const handleReverseTransaction = (tx: FinancialTransaction) => {
    if (confirm(`Bạn có chắc chắn muốn đảo giao dịch "${tx.title}" (${formatVND(tx.amount)})?`)) {
      const reversalTx: FinancialTransaction = {
        id: 'rev-' + Math.random().toString(36).substring(2, 9),
        classId: tx.classId,
        campaignId: tx.campaignId,
        studentId: tx.studentId,
        studentName: tx.studentName,
        type: 'REVERSAL',
        category: tx.category,
        title: `[ĐẢO GIAO DỊCH] ${tx.title}`,
        amount: -tx.amount,
        occurredAt: new Date().toISOString(),
        recordedAt: new Date().toISOString(),
        paymentMethod: tx.paymentMethod,
        payerOrPayee: tx.payerOrPayee,
        recordedByTeacherName: localStore.getUserSession().fullName,
        status: 'POSTED',
        reversalOfTransactionId: tx.id,
        notes: 'Điều chỉnh sai số giao dịch'
      };

      // Update original transaction status to REVERSED and save it
      const updatedOriginal = { ...tx, status: 'REVERSED' as const };
      localStore.saveFinancialTransaction(updatedOriginal);
      localStore.addFinancialTransaction(reversalTx);

      // If reversing student income, roll back student fee
      if (tx.campaignId && tx.studentId && tx.type === 'INCOME') {
        const fees = localStore.getStudentFees();
        const fee = fees.find(f => f.campaignId === tx.campaignId && f.studentId === tx.studentId);
        if (fee) {
          fee.paidAmount = Math.max(0, fee.paidAmount - tx.amount);
          fee.remainingAmount = Math.max(0, fee.requiredAmount - fee.paidAmount);
          fee.status = fee.paidAmount === 0 ? 'UNPAID' : (fee.remainingAmount === 0 ? 'PAID' : 'PARTIAL');
          localStore.saveStudentFees(fees);
          setFees(localStore.getStudentFees());
        }
      }

      setTransactions(localStore.getFinancialTransactions());
    }
  };

  const handleExportExcel = () => {
    ExcelService.exportFinanceLedger(transactions, currentClass.code || currentClass.name);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Wallet className="w-6 h-6 text-amber-600" />
            Quỹ Lớp & Ma trận Thu - Chi (Năm học 2026-2027)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Theo dõi minh bạch, đối soát sổ cái hai chiều và kiểm soát theo đúng quy định Thông tư 55/2011/TT-BGDĐT
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            icon={<Download className="w-4 h-4 text-emerald-600" />}
            onClick={handleExportExcel}
            className="text-xs sm:text-sm font-bold"
          >
            Xuất Sổ quỹ (Excel)
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<ArrowDownLeft className="w-4 h-4" />}
            onClick={() => setIsIncomeModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-xs sm:text-sm font-bold"
          >
            Ghi nhận Thu tiền
          </Button>

          <Button
            variant="danger"
            size="md"
            icon={<ArrowUpRight className="w-4 h-4" />}
            onClick={() => setIsExpenseModalOpen(true)}
            className="text-xs sm:text-sm font-bold"
          >
            Ghi nhận Khoản chi
          </Button>
        </div>
      </div>

      {/* Legal & Policy Guard Notice (FIN-000, TT55/2011) */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs sm:text-sm">
        <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Rào chắn Pháp lý & Minh bạch Thu chi (Legal Guard — TT55/2011/TT-BGDĐT):</p>
          <p className="text-amber-800 text-xs">
            Kinh phí hoạt động của Ban đại diện cha mẹ học sinh dựa trên nguyên tắc <strong>hoàn toàn tự nguyện</strong>, công khai và dân chủ. Hệ thống nghiêm cấm quy định mức đóng góp bình quân bắt buộc và nghiêm cấm chi cho các mục đích sai quy định (khen thưởng giáo viên, sửa chữa cơ sở vật chất nhà trường).
          </p>
        </div>
      </div>

      {/* KPI Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <StatCard
          title="Số dư Hiện tại trong Quỹ"
          value={formatVND(balance)}
          subtitle="Tính tự động từ sổ cái thu - chi"
          variant="amber"
          icon={<Wallet className="w-6 h-6" />}
        />
        <StatCard
          title="Tổng Thu đã Ghi sổ"
          value={formatVND(totalIncome)}
          subtitle={`${fees.filter(f => f.status === 'PAID').length} / ${fees.length} học sinh đã đóng góp`}
          variant="green"
          icon={<ArrowDownLeft className="w-6 h-6" />}
        />
        <StatCard
          title="Tổng Chi đã Quyết toán"
          value={formatVND(totalExpense)}
          subtitle={`${transactions.filter(t => t.type === 'EXPENSE').length} khoản chi có chứng từ`}
          variant="rose"
          icon={<ArrowUpRight className="w-6 h-6" />}
        />
      </div>

      {/* Tabs: Matrix vs Ledger */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[40px] ${
            activeTab === 'matrix' ? 'bg-brand-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Ma trận Thu theo Học sinh ({fees.length})
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[40px] ${
            activeTab === 'ledger' ? 'bg-brand-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Sổ cái Giao dịch ({transactions.length})
        </button>
      </div>

      {/* View: Student Fee Matrix */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left min-w-[600px]">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3.5 text-center w-12">STT</th>
                  <th className="p-3.5">Họ và tên học sinh</th>
                  <th className="p-3.5 text-right">Mức gợi ý</th>
                  <th className="p-3.5 text-right">Đã đóng góp</th>
                  <th className="p-3.5 text-right">Còn lại</th>
                  <th className="p-3.5 text-center">Trạng thái</th>
                  <th className="p-3.5 text-center">Ngày nộp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fees.map((f, i) => (
                  <tr key={f.studentId} className="hover:bg-slate-50">
                    <td className="p-3.5 text-center font-bold text-slate-400">{i + 1}</td>
                    <td className="p-3.5 font-bold text-slate-800">{f.studentName}</td>
                    <td className="p-3.5 text-right font-mono text-slate-600">{formatVND(f.requiredAmount)}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-emerald-700">{formatVND(f.paidAmount)}</td>
                    <td className="p-3.5 text-right font-mono text-slate-500">{formatVND(f.remainingAmount)}</td>
                    <td className="p-3.5 text-center">
                      <Badge variant={f.status === 'PAID' ? 'success' : 'warning'} size="sm">
                        {f.status === 'PAID' ? 'Đã nộp đủ' : 'Chưa nộp'}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-center text-slate-500 text-xs">
                      {f.lastPaidAt ? formatDateVN(f.lastPaidAt) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View: Transaction Ledger */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left min-w-[700px]">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3.5">Thời gian</th>
                  <th className="p-3.5">Loại</th>
                  <th className="p-3.5">Danh mục & Nội dung</th>
                  <th className="p-3.5 text-right">Số tiền (VNĐ)</th>
                  <th className="p-3.5">Người nộp / Nhận</th>
                  <th className="p-3.5">Hình thức</th>
                  <th className="p-3.5 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map(t => (
                  <tr key={t.id} className={`hover:bg-slate-50 ${t.status === 'REVERSED' ? 'opacity-40 line-through' : ''}`}>
                    <td className="p-3.5 text-slate-500 text-xs">{formatDateTimeVN(t.occurredAt)}</td>
                    <td className="p-3.5">
                      <Badge variant={t.type === 'INCOME' ? 'success' : (t.type === 'EXPENSE' ? 'danger' : 'purple')} size="sm">
                        {t.type === 'INCOME' ? 'Thu vào' : (t.type === 'EXPENSE' ? 'Chi ra' : 'Đảo')}
                      </Badge>
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-800">{t.title}</p>
                      <p className="text-[11px] text-slate-500">{t.category} {t.referenceNo && `• Số CT: ${t.referenceNo}`}</p>
                    </td>
                    <td className={`p-3.5 text-right font-mono font-bold ${t.type === 'INCOME' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {t.type === 'INCOME' ? `+${formatVND(t.amount)}` : `-${formatVND(t.amount)}`}
                    </td>
                    <td className="p-3.5 text-slate-700">{t.payerOrPayee}</td>
                    <td className="p-3.5 text-slate-600 text-xs">
                      {t.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản' : 'Tiền mặt'}
                    </td>
                    <td className="p-3.5 text-center">
                      {t.status === 'POSTED' && t.type !== 'REVERSAL' && (
                        <button
                          onClick={() => handleReverseTransaction(t)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors text-xs font-semibold"
                          title="Đảo giao dịch (sửa sai số)"
                        >
                          <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                          Đảo
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-rose-600" />
            <span>Ghi nhận Khoản Chi từ Quỹ Lớp</span>
          </div>
        }
      >
        <form onSubmit={handleRecordExpense} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung chi *</label>
            <input
              type="text"
              required
              value={expenseTitle}
              onChange={e => setExpenseTitle(e.target.value)}
              placeholder="VD: Mua nước uống đóng bình và văn phòng phẩm..."
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số tiền (VNĐ) *</label>
              <input
                type="number"
                required
                min={1000}
                step={5000}
                value={expenseAmount}
                onChange={e => setExpenseAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono font-bold border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Danh mục chi</label>
                <button type="button" onClick={() => { setCategoryType('expense'); setIsCategoryModalOpen(true); }} className="text-[10px] text-brand-600 hover:underline">
                  Quản lý
                </button>
              </div>
              <select
                value={expenseCategory}
                onChange={e => setExpenseCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              >
                {categories.expense.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Đơn vị thụ hưởng / Cửa hàng</label>
              <input
                type="text"
                value={expensePayee}
                onChange={e => setExpensePayee(e.target.value)}
                placeholder="VD: Hiệu sách Hồng Hà..."
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số hóa đơn / Phiếu chi</label>
              <input
                type="text"
                value={expenseReceiptNo}
                onChange={e => setExpenseReceiptNo(e.target.value)}
                placeholder="VD: HD-00342..."
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsExpenseModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="danger" size="sm" type="submit">
              Xác nhận Ghi chi
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Income Modal */}
      <Modal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
            <span>Ghi nhận Thu tiền Đóng góp từ Học sinh</span>
          </div>
        }
      >
        <form onSubmit={handleRecordIncome} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Chọn học sinh nộp tiền *</label>
            <select
              required
              value={incomeStudentId}
              onChange={e => setIncomeStudentId(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500 font-bold text-slate-800"
            >
              <option value="">-- Chọn học sinh trong danh sách {currentClass.name} --</option>
              {localStore.getStudents().map(s => (
                <option key={s.id} value={s.id}>
                  {s.studentCode} - {s.fullName} ({s.groupName || 'Tổ 1'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số tiền nộp (VNĐ) *</label>
              <input
                type="number"
                required
                min={10000}
                step={10000}
                value={incomeAmount}
                onChange={e => setIncomeAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono font-bold border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Danh mục thu</label>
                <button type="button" onClick={() => { setCategoryType('income'); setIsCategoryModalOpen(true); }} className="text-[10px] text-brand-600 hover:underline">Quản lý</button>
              </div>
              <select
                value={incomeCategory}
                onChange={e => setIncomeCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              >
                {categories.income.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hình thức thanh toán</label>
              <select
                value={incomeMethod}
                onChange={e => setIncomeMethod(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
              >
                <option value="BANK_TRANSFER">Chuyển khoản</option>
                <option value="CASH">Tiền mặt</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsIncomeModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              Xác nhận Ghi thu
            </Button>
          </div>
        </form>
      </Modal>

      {/* Quản lý danh mục Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={categoryType === 'income' ? 'Quản lý Danh mục Thu' : 'Quản lý Danh mục Chi'}
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              placeholder="Nhập tên danh mục mới..."
              className="flex-1 px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-500"
            />
            <Button variant="primary" size="sm" onClick={handleAddCategory}>
              Thêm
            </Button>
          </div>
          <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-2">
            {categories[categoryType].map(cat => {
              const isUsed = transactions.some(t => t.category === cat);
              return (
                <div key={cat} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  {editingCategory === cat ? (
                    <div className="flex-1 flex gap-2 mr-2">
                      <input
                        type="text"
                        value={editCategoryName}
                        onChange={e => setEditCategoryName(e.target.value)}
                        className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded outline-none"
                      />
                      <button onClick={() => handleSaveEditCategory(cat)} className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded">Lưu</button>
                      <button onClick={() => setEditingCategory(null)} className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">Hủy</button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-semibold text-slate-800">{cat}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setEditCategoryName(cat);
                          }}
                          className="text-xs px-2 py-1 rounded-lg transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          disabled={isUsed}
                          className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                            isUsed 
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                          title={isUsed ? 'Không thể xóa (Đang có giao dịch dùng danh mục này)' : 'Xóa danh mục'}
                        >
                          Xóa
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 italic">
            * Lưu ý: Các danh mục đã có giao dịch phát sinh sẽ không thể xóa để đảm bảo toàn vẹn dữ liệu sổ cái kế toán.
          </p>
        </div>
      </Modal>
    </div>
  );
};
