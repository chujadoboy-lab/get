import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  TrendingUp,
  Calendar,
  AlertCircle,
  Clock,
  RefreshCcw,
  DollarSign,
  CreditCard,
  CheckCircle2,
  Package,
  Maximize,
  Minimize,
  Moon,
  Sun,
} from 'lucide-react';

// 🌟 [핵심] 잃어버린 디자인 도구(Tailwind) 자동 주입 & 다크모드 완벽 설정
if (typeof window !== 'undefined') {
  if (!document.querySelector('script[src*="tailwindcss"]')) {
    const configScript = document.createElement('script');
    configScript.innerHTML = `window.tailwind = { config: { darkMode: 'class' } };`;
    document.head.appendChild(configScript);

    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(tailwindScript);
  } else if (window.tailwind) {
    window.tailwind.config = { darkMode: 'class' };
  }
}

// --- 샘플 데이터 (구글 시트 연동 전 표시용) ---
const mockData = [
  {
    날짜: '2023-10-25',
    매출: 150000,
    결제방식: '카드',
    진행상태: '완료',
    납기예정일: '2023-10-26',
    상호: '에이원컴퍼니',
    연락처: '010-1111-2222',
    품목: '현수막 50장',
    후가공: '사방타공',
  },
  {
    날짜: '2023-10-25',
    매출: 320000,
    결제방식: '미수',
    진행상태: '대기',
    납기예정일: '2023-10-28',
    상호: '세종디자인',
    연락처: '010-3333-4444',
    품목: '라텍스 실사',
    후가공: '무광코팅',
  },
  {
    날짜: '2023-10-26',
    매출: 450000,
    결제방식: '미수',
    진행상태: '대기',
    납기예정일: '2023-10-30',
    상호: '픽스디자인',
    연락처: '010-7777-8888',
    품목: '아크릴 현판',
    후가공: '양면테이프',
  },
  {
    날짜: '2023-10-28',
    매출: 550000,
    결제방식: '미수',
    진행상태: '대기',
    납기예정일: '2023-11-02',
    상호: 'LG전자',
    연락처: '010-1234-5678',
    품목: '대형 현수막',
    후가공: '로프미싱',
  },
];

const mockExpenseData = [
  { 날짜: '2023-10-25', 지출금액: 50000, 내용: '사무용품' },
];

export default function App() {
  const [salesData, setSalesData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [now, setNow] = useState(new Date());
  const tableContainerRef = useRef(null);

  // 다크모드 화면 제어
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 실시간 시계 업데이트 (1초 주기)
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 구글 시트 데이터 가져오기
  const fetchSheetData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);

    const sheetId = '1HHT5zM80NA0WDa2Zq71MANTaRMqBt5Smr1Pdvz1x_6w';
    const baseUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

    const fetchGvizData = async (url) => {
      const response = await fetch(url);
      const text = await response.text();
      const match = text.match(
        /google\.visualization\.Query\.setResponse\(([\s\S\w]+)\);/
      );
      if (!match) return [];
      const jsonData = JSON.parse(match[1]);
      const cols = jsonData.table.cols.map(
        (col) => col.label?.trim() || 'Unknown'
      );
      return jsonData.table.rows.map((row) => {
        const rowData = {};
        row.c.forEach((cell, i) => {
          if (cols[i] !== 'Unknown') {
            rowData[cols[i]] = cell ? cell.f || cell.v : '';
          }
        });
        return rowData;
      });
    };

    try {
      const parsedSalesData = await fetchGvizData(baseUrl);
      setSalesData(parsedSalesData);
      try {
        const parsedExpenseData = await fetchGvizData(
          `${baseUrl}&sheet=지출현황`
        );
        setExpenseData(parsedExpenseData);
      } catch (e) {
        setExpenseData([]);
      }
    } catch (err) {
      setSalesData(mockData);
      setExpenseData(mockExpenseData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheetData();
    const intervalId = setInterval(() => fetchSheetData(true), 30000);
    return () => clearInterval(intervalId);
  }, []);

  // 전체화면 토글 로직
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    try {
      if (!isFullscreen && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else if (isFullscreen && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (e) {}
  };

  // Esc 키를 누르면 전체화면 해제
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const parseNumber = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const num = Number(val.toString().replace(/[^0-9.-]+/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const dashboardStats = useMemo(() => {
    let unpaidTotal = 0;
    const dailySalesMap = {};
    const monthlySalesMap = {};
    const monthlyExpenseMap = {};
    const unpaidList = [];
    const pendingList = [];
    const readyToShipList = []; // 🌟 출고 대기(완료) 목록 배열 추가

    const getField = (row, possibleNames) => {
      const key = Object.keys(row).find((k) =>
        possibleNames.some((name) => k.includes(name))
      );
      return key ? row[key] : '';
    };

    salesData.forEach((row) => {
      const dateStr =
        getField(row, ['날짜', '일자', '등록일', '접수일', '주문일']) || '미상';
      const sales = parseNumber(
        getField(row, ['매출', '금액', '합계', '단가'])
      );
      const payment =
        getField(row, ['결제방식', '결제', '수금'])?.toString() || '';
      const status = getField(row, ['진행상태', '상태'])?.toString() || '';
      const deliveryDate = getField(row, ['납기예정일', '납기일']) || '-';
      const company = getField(row, ['상호', '업체명', '거래처']) || '-';
      const contact =
        getField(row, ['연락처', '전화번호', '핸드폰', '휴대폰']) || '-';
      const item = getField(row, ['품목', '상품명', '내용']) || '-';
      const postProc = getField(row, ['후가공', '비고']) || '-';

      if (dateStr !== '미상') {
        const shortDate = dateStr.split(' ')[0];
        const monthStr = shortDate.substring(0, 7);
        dailySalesMap[shortDate] = (dailySalesMap[shortDate] || 0) + sales;
        monthlySalesMap[monthStr] = (monthlySalesMap[monthStr] || 0) + sales;
      }

      // 미수금 목록
      if (payment.includes('미수')) {
        unpaidTotal += sales;
        unpaidList.push({
          date: dateStr,
          company,
          contact,
          sales,
          item,
          deliveryDate,
        });
      }

      // 작업 대기 목록 (대기 상태의 모든 품목 포함)
      if (status.includes('대기')) {
        pendingList.push({
          status: '대기',
          deliveryDate,
          company,
          item,
          postProc,
        });
      }

      // 🌟 출고 대기 목록 (상태가 '완료'인 경우)
      if (status.includes('완료')) {
        readyToShipList.push({
          date: dateStr,
          company,
          contact,
          sales,
          item,
          deliveryDate,
        });
      }
    });

    expenseData.forEach((row) => {
      const dateStr =
        getField(row, ['날짜', '일자', '지출일', '등록일']) || '미상';
      const expense = parseNumber(
        getField(row, ['지출금액', '금액', '지출', '합계'])
      );
      if (dateStr !== '미상') {
        const monthStr = dateStr.split(' ')[0].substring(0, 7);
        monthlyExpenseMap[monthStr] =
          (monthlyExpenseMap[monthStr] || 0) + expense;
      }
    });

    const availableDates = Object.keys(dailySalesMap).sort(
      (a, b) => new Date(b) - new Date(a)
    );
    const availableMonths = Object.keys(monthlySalesMap).sort(
      (a, b) => new Date(b) - new Date(a)
    );

    return {
      dailySalesMap,
      monthlySalesMap,
      monthlyExpenseMap,
      availableDates,
      availableMonths,
      unpaidTotal,
      unpaidList: unpaidList.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      ),
      pendingList: pendingList.sort(
        (a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate)
      ),
      readyToShipList: readyToShipList.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      ), // 날짜순 정렬
    };
  }, [salesData, expenseData]);

  useEffect(() => {
    if (dashboardStats.availableDates.length > 0) {
      const todayStr = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      if (!selectedDate)
        setSelectedDate(
          dashboardStats.availableDates.includes(todayStr)
            ? todayStr
            : dashboardStats.availableDates[0]
        );
      if (!selectedMonth) setSelectedMonth(todayStr.substring(0, 7));
    }
  }, [dashboardStats.availableDates, now]);

  const displayTodaySales = dashboardStats.dailySalesMap[selectedDate] || 0;
  const displayMonthlySales =
    dashboardStats.monthlySalesMap[selectedMonth] || 0;
  const displayMonthlyExpense =
    dashboardStats.monthlyExpenseMap[selectedMonth] || 0;
  const displayMonthlyProfit = displayMonthlySales - displayMonthlyExpense;

  const formattedDate = now.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  const formattedTime = now.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
        <RefreshCcw className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* 방해 스타일 완전 무력화 및 다크모드 배경 고정 */}
      <style>{`
        html, body { margin: 0 !important; padding: 0 !important; width: 100% !important; height: 100% !important; min-height: 100vh !important; display: block !important; }
        html.dark body { background-color: #0f172a !important; }
        #root { max-width: 100% !important; width: 100% !important; margin: 0 !important; padding: 0 !important; display: block !important; text-align: left !important; }
        .dashboard-container * { transition: background-color 0.2s, border-color 0.2s, color 0.2s; }
      `}</style>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8 font-sans">
        <div className="w-full max-w-[1600px] mx-auto space-y-6">
          {/* 헤더 섹션 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 m-0 p-0 leading-none mb-1">
                <Package className="text-blue-600 dark:text-blue-400" />
                디자인겟 매출 현황
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 m-0 p-0 leading-none">
                디자인겟 주문 현황 실시간 연동 대시보드{' '}
                <span className="text-blue-500 dark:text-blue-400 font-bold">
                  (30초 주기 자동 업데이트)
                </span>
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 font-bold shadow-sm"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                {isDarkMode ? '라이트모드' : '다크모드'}
              </button>
              <button
                onClick={() => fetchSheetData(false)}
                className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 font-bold shadow-sm"
              >
                <RefreshCcw className="w-4 h-4" />
                새로고침
              </button>
            </div>
          </div>

          {/* 요약 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="일 매출"
              value={displayTodaySales}
              icon={<TrendingUp className="w-6 h-6 text-blue-500" />}
              color="bg-blue-50 dark:bg-blue-900/30"
              selector={
                dashboardStats.availableDates.length > 0 && (
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="text-xs border border-slate-200 dark:border-slate-600 rounded p-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold outline-none"
                  >
                    {dashboardStats.availableDates.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                )
              }
            />
            <StatCard
              title="월 매출"
              value={displayMonthlySales}
              icon={<Calendar className="w-6 h-6 text-emerald-500" />}
              color="bg-emerald-50 dark:bg-emerald-900/30"
              selector={
                dashboardStats.availableMonths.length > 0 && (
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="text-xs border border-slate-200 dark:border-slate-600 rounded p-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold outline-none"
                  >
                    {dashboardStats.availableMonths.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                )
              }
            />
            <StatCard
              title="영업이익"
              value={displayMonthlyProfit}
              icon={<DollarSign className="w-6 h-6 text-purple-500" />}
              color="bg-purple-50 dark:bg-purple-900/30"
              selector={
                dashboardStats.availableMonths.length > 0 && (
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="text-xs border border-slate-200 dark:border-slate-600 rounded p-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold outline-none"
                  >
                    {dashboardStats.availableMonths.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                )
              }
            />
            <StatCard
              title="총 미수금액"
              value={dashboardStats.unpaidTotal}
              icon={<AlertCircle className="w-6 h-6 text-red-500" />}
              color="bg-red-50 dark:bg-red-900/30"
              valueColor="text-red-600 dark:text-red-400"
            />
          </div>

          {/* 미수 리스트 */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                미수금 리스트
              </h2>
              <span className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 text-sm font-black px-4 py-1 rounded-full shadow-sm">
                {dashboardStats.unpaidList.length}건
              </span>
            </div>
            <div
              className="overflow-auto scroll-smooth"
              style={{ maxHeight: '480px' }}
            >
              <table className="w-full text-left border-collapse font-bold">
                <thead className="sticky top-0 z-20 shadow-sm">
                  <tr className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <th className="py-3 px-4 whitespace-nowrap">주문일</th>
                    <th className="py-3 px-4 whitespace-nowrap">상호</th>
                    <th className="py-3 px-4 whitespace-nowrap">연락처</th>
                    <th className="py-3 px-4 whitespace-nowrap">품목</th>
                    <th className="py-3 px-4 whitespace-nowrap">납기일</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">
                      금액
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {dashboardStats.unpaidList.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {item.company}
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {item.contact}
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {item.item}
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {item.deliveryDate}
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap">
                        {new Intl.NumberFormat('ko-KR').format(item.sales)}원
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 🌟 출고 대기 목록 (새로 추가됨) */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                출고 대기 목록
              </h2>
              <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-sm font-black px-4 py-1 rounded-full shadow-sm">
                {dashboardStats.readyToShipList.length}건
              </span>
            </div>
            {/* 15개 정도 보이도록 높이를 720px로 설정 */}
            <div
              className="overflow-auto scroll-smooth"
              style={{ maxHeight: '720px' }}
            >
              <table className="w-full text-left border-collapse font-bold">
                <thead className="sticky top-0 z-20 shadow-sm">
                  <tr className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <th className="py-3 px-4 whitespace-nowrap">주문일</th>
                    <th className="py-3 px-4 whitespace-nowrap">상호</th>
                    <th className="py-3 px-4 whitespace-nowrap">연락처</th>
                    <th className="py-3 px-4 whitespace-nowrap">품목</th>
                    <th className="py-3 px-4 whitespace-nowrap">납기일</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">
                      금액
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {dashboardStats.readyToShipList.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {item.company}
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {item.contact}
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {item.item}
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {item.deliveryDate}
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap">
                        {new Intl.NumberFormat('ko-KR').format(item.sales)}원
                      </td>
                    </tr>
                  ))}
                  {dashboardStats.readyToShipList.length === 0 && (
                    <tr className="bg-white dark:bg-slate-800">
                      <td
                        colSpan="6"
                        className="text-center text-slate-500 dark:text-slate-400 font-bold py-10 text-sm"
                      >
                        현재 출고 대기 중인 작업이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 작업 대기 목록: 폰트 18px로 축소 및 줄 간격(py-2) 축소 적용 */}
          <div
            ref={tableContainerRef}
            className={`bg-white dark:bg-slate-800 flex flex-col transition-all duration-300 ${
              isFullscreen
                ? 'fixed inset-0 z-[9999] w-full h-full !mt-0 !rounded-none border-none p-10 overflow-auto bg-white dark:bg-slate-900'
                : 'shadow-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl overflow-hidden relative'
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
              <div className="flex items-center gap-3">
                <Clock
                  className={`text-blue-500 dark:text-blue-400 ${
                    isFullscreen ? 'w-8 h-8' : 'w-5 h-5'
                  }`}
                />
                <h2
                  className={`font-bold text-slate-900 dark:text-white whitespace-nowrap ${
                    isFullscreen ? 'text-[1.5rem]' : 'text-lg'
                  }`}
                >
                  작업 대기 목록
                </h2>
                <div className="flex items-center ml-1">
                  <span
                    className={`bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 font-black rounded-full shadow-sm ${
                      isFullscreen ? 'text-lg px-4 py-1.5' : 'text-sm px-4 py-1'
                    }`}
                  >
                    {dashboardStats.pendingList.length}건
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div
                  className={`font-bold text-slate-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-100 dark:border-slate-600 ${
                    isFullscreen ? 'text-lg px-4 py-2' : 'text-sm px-3 py-1.5'
                  }`}
                >
                  {formattedDate}
                  <span className="ml-2 text-blue-600 dark:text-blue-400 font-bold">
                    {formattedTime}
                  </span>
                </div>
                <button
                  onClick={toggleFullscreen}
                  className={`text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                    isFullscreen ? 'p-2' : 'p-1.5'
                  }`}
                >
                  {isFullscreen ? (
                    <Minimize className="w-7 h-7" />
                  ) : (
                    <Maximize className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto flex-1 scroll-smooth">
              <table className="w-full text-left border-collapse font-bold">
                <thead className="sticky top-0 z-20 shadow-sm">
                  <tr
                    className={`text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-slate-800 ${
                      isFullscreen
                        ? 'border-b-2 border-blue-300 dark:border-blue-600'
                        : 'border-b border-blue-100 dark:border-blue-900/50'
                    }`}
                  >
                    <th
                      className={`whitespace-nowrap font-bold ${
                        isFullscreen
                          ? 'px-6 py-2 text-[18px]'
                          : 'px-4 py-3 text-sm'
                      }`}
                    >
                      진행상태
                    </th>
                    <th
                      className={`whitespace-nowrap font-bold ${
                        isFullscreen
                          ? 'px-6 py-2 text-[18px]'
                          : 'px-4 py-3 text-sm'
                      }`}
                    >
                      납기예정일
                    </th>
                    <th
                      className={`whitespace-nowrap font-bold ${
                        isFullscreen
                          ? 'px-6 py-2 text-[18px]'
                          : 'px-4 py-3 text-sm'
                      }`}
                    >
                      상호
                    </th>
                    <th
                      className={`whitespace-nowrap font-bold ${
                        isFullscreen
                          ? 'px-6 py-2 text-[18px]'
                          : 'px-4 py-3 text-sm'
                      }`}
                    >
                      품목
                    </th>
                    <th
                      className={`whitespace-nowrap font-bold ${
                        isFullscreen
                          ? 'px-6 py-2 text-[18px]'
                          : 'px-4 py-3 text-sm'
                      }`}
                    >
                      후가공
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`text-slate-900 dark:text-slate-100 ${
                    isFullscreen
                      ? 'divide-y-2 divide-slate-300 dark:divide-slate-600'
                      : 'divide-y divide-slate-100 dark:divide-slate-700/50'
                  }`}
                >
                  {dashboardStats.pendingList.length > 0 ? (
                    dashboardStats.pendingList.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors bg-white dark:bg-slate-800"
                      >
                        <td
                          className={`whitespace-nowrap ${
                            isFullscreen ? 'px-6 py-2' : 'px-4 py-3'
                          }`}
                        >
                          <span
                            className={`inline-flex items-center rounded-full font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 ${
                              isFullscreen
                                ? 'gap-1.5 py-1 px-3 text-[16px]'
                                : 'gap-1.5 py-1 px-3 text-xs'
                            }`}
                          >
                            <div
                              className={`rounded-full bg-blue-500 dark:bg-blue-400 ${
                                isFullscreen ? 'w-3 h-3' : 'w-1.5 h-1.5'
                              }`}
                            ></div>
                            {item.status}
                          </span>
                        </td>
                        <td
                          className={`font-bold whitespace-nowrap ${
                            isFullscreen
                              ? 'px-6 py-2 text-[18px]'
                              : 'px-4 py-3 text-sm'
                          }`}
                        >
                          {item.deliveryDate}
                        </td>
                        <td
                          className={`font-bold whitespace-nowrap ${
                            isFullscreen
                              ? 'px-6 py-2 text-[18px]'
                              : 'px-4 py-3 text-sm'
                          }`}
                        >
                          {item.company}
                        </td>
                        <td
                          className={`font-bold whitespace-nowrap ${
                            isFullscreen
                              ? 'px-6 py-2 text-[18px]'
                              : 'px-4 py-3 text-sm'
                          }`}
                        >
                          {item.item}
                        </td>
                        <td
                          className={`font-bold whitespace-nowrap ${
                            isFullscreen
                              ? 'px-6 py-2 text-[18px]'
                              : 'px-4 py-3 text-sm'
                          }`}
                        >
                          {item.postProc}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white dark:bg-slate-800">
                      <td
                        colSpan="5"
                        className={`text-center text-slate-500 dark:text-slate-400 font-bold ${
                          isFullscreen ? 'py-8 text-[18px]' : 'py-10 text-sm'
                        }`}
                      >
                        현재 대기 중인 작업이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  valueColor = 'text-slate-900 dark:text-white',
  selector,
}) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4 transition-colors">
      <div className={`p-4 rounded-xl ${color}`}>{icon}</div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
            {title}
          </p>
          {selector}
        </div>
        <p className={`text-2xl font-bold ${valueColor}`}>
          {new Intl.NumberFormat('ko-KR').format(value)}
          <span className="text-base font-normal text-slate-500 dark:text-slate-400 ml-1">
            원
          </span>
        </p>
      </div>
    </div>
  );
}
