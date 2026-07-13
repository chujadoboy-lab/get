import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  TrendingUp, Calendar, AlertCircle, Clock, RefreshCcw, DollarSign, CreditCard, 
  CheckCircle2, Package, Maximize, Minimize, Moon, Sun, LayoutDashboard, Flag, ListTodo, BarChart3, Ticket
} from 'lucide-react';

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

const mockData = [
  { 날짜: '2023-10-25', 매출: 150000, 결제방식: '카드', 진행상태: '완료', 납기예정일: '2023-10-26', 상호: '에이원컴퍼니', 연락처: '010-1111-2222', 품목: '현수막 50장', 후가공: '사방타공' },
  { 날짜: '2023-10-25', 매출: 320000, 결제방식: '미수', 진행상태: '대기', 납기예정일: '2023-10-28', 상호: '세종디자인', 연락처: '010-3333-4444', 품목: '라텍스 실사', 후가공: '무광코팅' },
  { 날짜: '2023-10-26', 매출: 450000, 결제방식: '미수', 진행상태: '대기', 납기예정일: '2023-10-30', 상호: '픽스디자인', 연락처: '010-7777-8888', 품목: '아크릴 현판', 후가공: '양면테이프' },
  { 날짜: '2023-10-28', 매출: 550000, 결제방식: '미수', 진행상태: '대기', 납기예정일: '2023-11-02', 상호: 'LG전자', 연락처: '010-1234-5678', 품목: '대형 현수막', 후가공: '로프미싱' },
  { 날짜: '2023-10-29', 매출: 120000, 결제방식: '카드', 진행상태: '완료', 납기예정일: '2023-10-30', 상호: '시청', 연락처: '010-9999-0000', 품목: '게시대현수막', 후가공: '각목' },
  { 날짜: '2023-10-30', 매출: 80000, 결제방식: '무통장', 진행상태: '출고', 납기예정일: '2023-11-05', 상호: '구청', 연락처: '010-5555-6666', 품목: '추첨대행', 후가공: '-' },
  { 날짜: '2023-11-05', 매출: 620000, 결제방식: '카드', 진행상태: '완료', 납기예정일: '2023-11-08', 상호: '디자인샘터', 연락처: '010-2222-3333', 품목: '라텍스 실사', 후가공: '코팅' },
  { 날짜: '2023-12-10', 매출: 890000, 결제방식: '카드', 진행상태: '완료', 납기예정일: '2023-12-15', 상호: '베스트광고', 연락처: '010-4444-5555', 품목: '일반 현수막', 후가공: '사방타공' },
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
  const [itemMonth, setItemMonth] = useState(''); 
  const [bannerMonth, setBannerMonth] = useState('');
  const [lotteryMonth, setLotteryMonth] = useState(''); // 추첨대행 월 필터 상태 추가
  const [chartYear, setChartYear] = useState(''); 
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [now, setNow] = useState(new Date()); 
  const [activeTab, setActiveTab] = useState('dashboard');
  const tableContainerRef = useRef(null);

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) html.classList.add('dark');
    else html.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchSheetData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    
    const sheetId = '1HHT5zM80NA0WDa2Zq71MANTaRMqBt5Smr1Pdvz1x_6w';
    const baseUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

    const fetchGvizData = async (url) => {
      const response = await fetch(url);
      const text = await response.text();
      const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\);/);
      if (!match) return [];
      const jsonData = JSON.parse(match[1]);
      const cols = jsonData.table.cols.map(col => col.label?.trim() || 'Unknown');
      return jsonData.table.rows.map(row => {
        const rowData = {};
        row.c.forEach((cell, i) => {
          if (cols[i] !== 'Unknown') rowData[cols[i]] = cell ? (cell.f || cell.v) : '';
        });
        return rowData;
      });
    };

    try {
      const parsedSalesData = await fetchGvizData(baseUrl);
      setSalesData(parsedSalesData.length > 0 ? parsedSalesData : mockData);
      try {
        const parsedExpenseData = await fetchGvizData(`${baseUrl}&sheet=지출현황`);
        setExpenseData(parsedExpenseData.length > 0 ? parsedExpenseData : mockExpenseData);
      } catch (e) {
        setExpenseData(mockExpenseData);
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

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') setIsFullscreen(false); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const parseNumber = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const num = Number(val.toString().replace(/[^0-9.-]+/g,""));
    return isNaN(num) ? 0 : num;
  };

  const getStatusBadge = (status) => {
    const base = "inline-flex items-center rounded-full font-bold px-2.5 py-0.5 text-xs";
    if (status.includes('완료')) return `${base} bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300`;
    if (status.includes('출고')) return `${base} bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300`;
    if (status.includes('대기')) return `${base} bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300`;
    return `${base} bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300`;
  }

  const getPaymentBadge = (payment) => {
    const base = "inline-flex items-center rounded-full font-bold px-2.5 py-0.5 text-xs";
    if (!payment) return '';
    if (payment.includes('미수')) return `${base} bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300`;
    if (payment.includes('카드')) return `${base} bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300`;
    if (payment.includes('입금') || payment.includes('무통장')) return `${base} bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300`;
    if (payment.includes('현금')) return `${base} bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300`;
    return `${base} bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300`;
  }

  const dashboardStats = useMemo(() => {
    let unpaidTotal = 0;
    const dailySalesMap = {};
    const monthlySalesMap = {};
    const monthlyExpenseMap = {};
    const monthlyItemSalesMap = {};
    const unpaidList = [];
    const pendingList = [];
    const readyToShipList = []; 
    const bannerList = []; // 게시대현수막 전용 리스트
    const lotteryList = []; // 추첨대행 전용 리스트
    const yearsSet = new Set();

    const getField = (row, possibleNames) => {
      const key = Object.keys(row).find(k => possibleNames.some(name => k.includes(name)));
      return key ? row[key] : '';
    };

    const categorizeItem = (itemStr) => {
      if (!itemStr) return '기타';
      const str = itemStr.toString().replace(/\s/g, ''); 
      if (str.includes('친환경')) return '친환경현수막';
      if (str.includes('게시대')) return '게시대 현수막';
      if (str.includes('현수막')) return '일반 현수막';
      if (str.includes('수성')) return '수성 실사';
      if (str.includes('라텍스')) return '라텍스 실사';
      if (str.includes('배너')) return '배너';
      if (str.includes('인쇄물')) return '인쇄물';
      if (str.includes('추첨대행') || str.includes('추첨')) return '추첨대행';
      return '기타';
    };

    salesData.forEach(row => {
      const dateStr = getField(row, ['날짜', '일자', '등록일', '접수일', '주문일']) || '미상';
      const sales = parseNumber(getField(row, ['매출', '금액', '합계', '단가']));
      const payment = getField(row, ['결제방식', '결제', '수금'])?.toString() || '';
      const status = getField(row, ['진행상태', '상태'])?.toString() || '';
      const deliveryDate = getField(row, ['납기예정일', '납기일']) || '-';
      const company = getField(row, ['상호', '업체명', '거래처']) || '-';
      const contact = getField(row, ['연락처', '전화번호', '핸드폰', '휴대폰']) || '-';
      const item = getField(row, ['품목', '상품명', '내용']) || '-';
      const postProc = getField(row, ['후가공', '비고']) || '-';

      const cleanItem = item.toString().replace(/\s/g, '');

      let monthStr = '미상';
      if (dateStr !== '미상') {
        const shortDate = dateStr.split(' ')[0];
        monthStr = shortDate.substring(0, 7);
        const yearStr = shortDate.substring(0, 4);
        
        yearsSet.add(yearStr);
        dailySalesMap[shortDate] = (dailySalesMap[shortDate] || 0) + sales;
        monthlySalesMap[monthStr] = (monthlySalesMap[monthStr] || 0) + sales;

        const category = categorizeItem(item);
        if (!monthlyItemSalesMap[monthStr]) monthlyItemSalesMap[monthStr] = {};
        if (!monthlyItemSalesMap[monthStr][category]) monthlyItemSalesMap[monthStr][category] = { sales: 0, count: 0 };
        monthlyItemSalesMap[monthStr][category].sales += sales;
        monthlyItemSalesMap[monthStr][category].count += 1;
      }

      if (payment.includes('미수')) {
        unpaidTotal += sales;
        unpaidList.push({ date: dateStr, company, contact, sales, item, deliveryDate });
      }

      if (status.includes('대기')) {
        pendingList.push({ status: '대기', deliveryDate, company, item, postProc });
      }

      if (status.includes('완료')) {
        readyToShipList.push({ date: dateStr, company, contact, sales, item, deliveryDate, status });
      }

      // 게시대현수막과 추첨대행을 분리하여 리스트에 추가
      if (cleanItem.includes('게시대현수막')) {
        bannerList.push({ date: dateStr, month: monthStr, company, contact, sales, item, deliveryDate, status, payment });
      } else if (cleanItem.includes('추첨대행')) {
        lotteryList.push({ date: dateStr, month: monthStr, company, contact, sales, item, deliveryDate, status, payment });
      }
    });

    expenseData.forEach(row => {
      const dateStr = getField(row, ['날짜', '일자', '지출일', '등록일']) || '미상';
      const expense = parseNumber(getField(row, ['지출금액', '금액', '지출', '합계']));
      if (dateStr !== '미상') {
        const monthStr = dateStr.split(' ')[0].substring(0, 7);
        monthlyExpenseMap[monthStr] = (monthlyExpenseMap[monthStr] || 0) + expense;
      }
    });

    const monthlySalesData = Object.entries(monthlySalesMap)
      .map(([month, sales]) => ({ month, sales, year: month.substring(0, 4) }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return { 
      dailySalesMap, monthlySalesMap, monthlyExpenseMap, monthlyItemSalesMap, monthlySalesData,
      availableDates: Object.keys(dailySalesMap).sort((a, b) => new Date(b) - new Date(a)), 
      availableMonths: Object.keys(monthlySalesMap).sort((a, b) => new Date(b) - new Date(a)), 
      availableYears: Array.from(yearsSet).sort((a, b) => b.localeCompare(a)),
      unpaidTotal, 
      unpaidList: unpaidList.sort((a, b) => new Date(a.date) - new Date(b.date)), 
      pendingList: pendingList.sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate)),
      readyToShipList: readyToShipList.sort((a, b) => new Date(a.date) - new Date(b.date)),
      bannerList: bannerList.sort((a, b) => new Date(b.date) - new Date(a.date)),
      lotteryList: lotteryList.sort((a, b) => new Date(b.date) - new Date(a.date)), // 추첨대행 리스트
      availableBannerMonths: [...new Set(bannerList.map(b => b.month).filter(m => m !== '미상'))].sort((a, b) => new Date(b) - new Date(a)),
      availableLotteryMonths: [...new Set(lotteryList.map(l => l.month).filter(m => m !== '미상'))].sort((a, b) => new Date(b) - new Date(a)) // 추첨대행 월 목록
    };
  }, [salesData, expenseData]);

  useEffect(() => {
    if (dashboardStats.availableDates.length > 0) {
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const thisMonthStr = todayStr.substring(0, 7);
      const thisYearStr = todayStr.substring(0, 4);
      
      if (!selectedDate) setSelectedDate(dashboardStats.availableDates.includes(todayStr) ? todayStr : dashboardStats.availableDates[0]);
      if (!selectedMonth) setSelectedMonth(thisMonthStr);
      if (!itemMonth) setItemMonth(dashboardStats.availableMonths.includes(thisMonthStr) ? thisMonthStr : dashboardStats.availableMonths[0]); 
      if (!chartYear) setChartYear(dashboardStats.availableYears.includes(thisYearStr) ? thisYearStr : dashboardStats.availableYears[0]);
    }
  }, [dashboardStats.availableDates, dashboardStats.availableMonths, dashboardStats.availableYears, now, itemMonth, chartYear]);

  // 배너 및 추첨대행 초기 월 설정
  useEffect(() => {
    const thisMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    if (dashboardStats.availableBannerMonths.length > 0 && !bannerMonth) {
      setBannerMonth(dashboardStats.availableBannerMonths.includes(thisMonthStr) ? thisMonthStr : dashboardStats.availableBannerMonths[0]);
    }
    
    if (dashboardStats.availableLotteryMonths.length > 0 && !lotteryMonth) {
      setLotteryMonth(dashboardStats.availableLotteryMonths.includes(thisMonthStr) ? thisMonthStr : dashboardStats.availableLotteryMonths[0]);
    }
  }, [dashboardStats.availableBannerMonths, dashboardStats.availableLotteryMonths, now, bannerMonth, lotteryMonth]);

  const displayTodaySales = dashboardStats.dailySalesMap[selectedDate] || 0;
  const displayMonthlySales = dashboardStats.monthlySalesMap[selectedMonth] || 0;
  const displayMonthlyExpense = dashboardStats.monthlyExpenseMap[selectedMonth] || 0;
  const displayMonthlyProfit = displayMonthlySales - displayMonthlyExpense;

  const currentMonthItemSalesMap = dashboardStats.monthlyItemSalesMap[itemMonth] || {};
  const currentMonthItemSalesList = Object.entries(currentMonthItemSalesMap)
    .map(([name, data]) => ({ name, value: data.sales, count: data.count }))
    .sort((a, b) => b.value - a.value);
  const currentMonthItemSalesTotal = currentMonthItemSalesList.reduce((acc, curr) => acc + curr.value, 0);

  const displayBannerList = dashboardStats.bannerList.filter(b => b.month === bannerMonth);
  const displayLotteryList = dashboardStats.lotteryList.filter(l => l.month === lotteryMonth); // 추첨대행 리스트 필터링
  
  const chartDisplayData = dashboardStats.monthlySalesData.filter(d => d.year === chartYear);

  const formattedDate = now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  const formattedTime = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  const categories = [
    { id: 'dashboard', label: '대시보드', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'unpaid', label: '미수금 목록', icon: <CreditCard className="w-5 h-5" />, count: dashboardStats.unpaidList.length },
    { id: 'readyToShip', label: '출고 대기 목록', icon: <CheckCircle2 className="w-5 h-5" />, count: dashboardStats.readyToShipList.length },
    { id: 'pending', label: '작업 대기 목록', icon: <ListTodo className="w-5 h-5" />, count: dashboardStats.pendingList.length },
    { id: 'banner', label: '게시대 현수막', icon: <Flag className="w-5 h-5" />, count: displayBannerList.length }, 
    { id: 'lottery', label: '추첨대행', icon: <Ticket className="w-5 h-5" />, count: displayLotteryList.length }, // 추첨대행 카테고리 추가
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 transition-colors"><RefreshCcw className="w-12 h-12 text-blue-500 animate-spin" /></div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="일 매출" value={displayTodaySales} icon={<TrendingUp className="w-6 h-6 text-blue-500" />} color="bg-blue-50 dark:bg-blue-900/30"
                selector={dashboardStats.availableDates.length > 0 && (
                  <select value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="text-xs border border-slate-200 dark:border-slate-600 rounded p-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold outline-none">
                    {dashboardStats.availableDates.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                )}
              />
              <StatCard title="월 매출" value={displayMonthlySales} icon={<Calendar className="w-6 h-6 text-emerald-500" />} color="bg-emerald-50 dark:bg-emerald-900/30"
                selector={dashboardStats.availableMonths.length > 0 && (
                  <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="text-xs border border-slate-200 dark:border-slate-600 rounded p-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold outline-none">
                    {dashboardStats.availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                )}
              />
              <StatCard title="영업이익" value={displayMonthlyProfit} icon={<DollarSign className="w-6 h-6 text-purple-500" />} color="bg-purple-50 dark:bg-purple-900/30"
                selector={dashboardStats.availableMonths.length > 0 && (
                  <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="text-xs border border-slate-200 dark:border-slate-600 rounded p-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold outline-none">
                    {dashboardStats.availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                )}
              />
              <StatCard title="총 미수금액" value={dashboardStats.unpaidTotal} icon={<AlertCircle className="w-6 h-6 text-red-500" />} color="bg-red-50 dark:bg-red-900/30" valueColor="text-red-600 dark:text-red-400" />
            </div>

            <div className="mt-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    품목별 매출 순위
                  </h2>
                  {dashboardStats.availableMonths.length > 0 && (
                    <select 
                      value={itemMonth} 
                      onChange={e => setItemMonth(e.target.value)} 
                      className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold outline-none cursor-pointer"
                    >
                      {dashboardStats.availableMonths.map(m => <option key={m} value={m}>{m}월</option>)}
                    </select>
                  )}
                </div>
                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                  {currentMonthItemSalesList.length > 0 ? (
                    currentMonthItemSalesList.map((item, idx) => {
                      const percentage = currentMonthItemSalesTotal > 0 ? (item.value / currentMonthItemSalesTotal) * 100 : 0;
                      return (
                        <div key={idx} className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-sm font-bold items-center">
                            <div className="flex items-center gap-2 truncate pr-4">
                              <span className="text-slate-700 dark:text-slate-300">
                                {idx + 1}. {item.name}
                              </span>
                              <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md whitespace-nowrap">
                                {item.count}건
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-900 dark:text-white whitespace-nowrap">
                                {new Intl.NumberFormat('ko-KR').format(item.value)}원
                                <span className="text-blue-500 dark:text-blue-400 font-black ml-1.5 text-xs">({percentage.toFixed(1)}%)</span>
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-10 text-slate-500 dark:text-slate-400 text-sm font-bold">
                      해당 월의 데이터가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex-1 min-h-[350px]">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-500" />
                    월별 매출 추이
                  </h2>
                  {dashboardStats.availableYears.length > 0 && (
                    <select 
                      value={chartYear} 
                      onChange={e => setChartYear(e.target.value)} 
                      className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold outline-none cursor-pointer"
                    >
                      {dashboardStats.availableYears.map(y => <option key={y} value={y}>{y}년</option>)}
                    </select>
                  )}
                </div>
                <div className="flex-1 w-full relative pt-4 pb-2">
                  <MonthlySalesChart data={chartDisplayData} />
                </div>
              </div>
            </div>
          </>
        );
      
      case 'unpaid':
        return (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col w-full h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  미수금 리스트
                </h2>
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-4 py-1.5 rounded-lg flex items-center gap-2">
                  <span className="text-sm text-red-600 dark:text-red-400 font-bold">총 미수금액:</span>
                  <span className="text-lg text-red-700 dark:text-red-300 font-black">{new Intl.NumberFormat('ko-KR').format(dashboardStats.unpaidTotal)}원</span>
                </div>
              </div>
              <span className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 text-sm font-black px-4 py-1 rounded-full shadow-sm">
                {dashboardStats.unpaidList.length}건
              </span>
            </div>
            <div className="overflow-auto scroll-smooth flex-1 custom-scrollbar">
              <table className="w-full text-left border-collapse font-bold">
                <thead className="sticky top-0 z-20 shadow-sm">
                  <tr className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <th className="py-3 px-4 whitespace-nowrap">주문일</th>
                    <th className="py-3 px-4 whitespace-nowrap">상호</th>
                    <th className="py-3 px-4 whitespace-nowrap">연락처</th>
                    <th className="py-3 px-4 whitespace-nowrap">품목</th>
                    <th className="py-3 px-4 whitespace-nowrap">납기일</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">금액</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {dashboardStats.unpaidList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.date}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.company}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.contact}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.item}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.deliveryDate}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap">{new Intl.NumberFormat('ko-KR').format(item.sales)}원</td>
                    </tr>
                  ))}
                  {dashboardStats.unpaidList.length === 0 && (
                    <tr className="bg-white dark:bg-slate-800">
                      <td colSpan="6" className="text-center text-slate-500 dark:text-slate-400 font-bold py-10 text-sm">현재 미수금 내역이 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'readyToShip':
        return (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col w-full h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h2 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                출고 대기 목록 (완료)
              </h2>
              <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-sm font-black px-4 py-1 rounded-full shadow-sm">
                {dashboardStats.readyToShipList.length}건
              </span>
            </div>
            <div className="overflow-auto scroll-smooth flex-1 custom-scrollbar">
              <table className="w-full text-left border-collapse font-bold">
                <thead className="sticky top-0 z-20 shadow-sm">
                  <tr className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <th className="py-3 px-4 whitespace-nowrap">주문일</th>
                    <th className="py-3 px-4 whitespace-nowrap">상호</th>
                    <th className="py-3 px-4 whitespace-nowrap">연락처</th>
                    <th className="py-3 px-4 whitespace-nowrap">품목</th>
                    <th className="py-3 px-4 whitespace-nowrap">납기일</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">금액</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {dashboardStats.readyToShipList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.date}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.company}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.contact}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.item}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.deliveryDate}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap">{new Intl.NumberFormat('ko-KR').format(item.sales)}원</td>
                    </tr>
                  ))}
                  {dashboardStats.readyToShipList.length === 0 && (
                    <tr className="bg-white dark:bg-slate-800">
                      <td colSpan="6" className="text-center text-slate-500 dark:text-slate-400 font-bold py-10 text-sm">현재 출고 대기 중인 작업이 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'pending':
        return (
          <div 
            ref={tableContainerRef} 
            className={`bg-white dark:bg-slate-800 flex flex-col transition-all duration-300 w-full h-full min-h-[500px] ${
              isFullscreen 
                ? 'fixed inset-0 z-[9999] !mt-0 !rounded-none border-none p-10 overflow-auto bg-white dark:bg-slate-900 custom-scrollbar' 
                : 'shadow-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl relative'
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
              <div className="flex items-center gap-3">
                <Clock className={`text-blue-500 dark:text-blue-400 ${isFullscreen ? 'w-8 h-8' : 'w-5 h-5'}`} />
                <h2 className={`font-bold text-slate-900 dark:text-white whitespace-nowrap ${isFullscreen ? 'text-[1.5rem]' : 'text-lg'}`}>작업 대기 목록</h2>
                <div className="flex items-center ml-1">
                  <span className={`bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 font-black rounded-full shadow-sm ${isFullscreen ? 'text-lg px-4 py-1.5' : 'text-sm px-4 py-1'}`}>
                    {dashboardStats.pendingList.length}건
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className={`font-bold text-slate-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-100 dark:border-slate-600 ${isFullscreen ? 'text-lg px-4 py-2' : 'text-sm px-3 py-1.5'}`}>
                  {formattedDate} <span className="ml-2 text-blue-600 dark:text-blue-400 font-bold">{formattedTime}</span>
                </div>
                <button onClick={toggleFullscreen} className={`text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${isFullscreen ? 'p-2' : 'p-1.5'}`}>
                  {isFullscreen ? <Minimize className="w-7 h-7" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto flex-1 scroll-smooth custom-scrollbar">
              <table className="w-full text-left border-collapse font-bold">
                <thead className="sticky top-0 z-20 shadow-sm">
                  <tr className={`text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-slate-800 ${isFullscreen ? 'border-b-2 border-blue-300 dark:border-blue-600' : 'border-b border-blue-100 dark:border-blue-900/50'}`}>
                    <th className={`whitespace-nowrap font-bold ${isFullscreen ? 'px-6 py-2 text-[18px]' : 'px-4 py-3 text-sm'}`}>진행상태</th>
                    <th className={`whitespace-nowrap font-bold ${isFullscreen ? 'px-6 py-2 text-[18px]' : 'px-4 py-3 text-sm'}`}>납기예정일</th>
                    <th className={`whitespace-nowrap font-bold ${isFullscreen ? 'px-6 py-2 text-[18px]' : 'px-4 py-3 text-sm'}`}>상호</th>
                    <th className={`whitespace-nowrap font-bold ${isFullscreen ? 'px-6 py-2 text-[18px]' : 'px-4 py-3 text-sm'}`}>품목</th>
                    <th className={`whitespace-nowrap font-bold ${isFullscreen ? 'px-6 py-2 text-[18px]' : 'px-4 py-3 text-sm'}`}>후가공</th>
                  </tr>
                </thead>
                <tbody className={`text-slate-900 dark:text-slate-100 ${isFullscreen ? 'divide-y-2 divide-slate-300 dark:divide-slate-600' : 'divide-y divide-slate-100 dark:divide-slate-700/50'}`}>
                  {dashboardStats.pendingList.length > 0 ? (
                    dashboardStats.pendingList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors bg-white dark:bg-slate-800">
                        <td className={`whitespace-nowrap ${isFullscreen ? 'px-6 py-2' : 'px-4 py-3'}`}>
                          <span className={getStatusBadge(item.status)}>{item.status}</span>
                        </td>
                        <td className={`font-bold whitespace-nowrap ${isFullscreen ? 'px-6 py-2 text-[18px]' : 'px-4 py-3 text-sm'}`}>{item.deliveryDate}</td>
                        <td className={`font-bold whitespace-nowrap ${isFullscreen ? 'px-6 py-2 text-[18px]' : 'px-4 py-3 text-sm'}`}>{item.company}</td>
                        <td className={`font-bold whitespace-nowrap ${isFullscreen ? 'px-6 py-2 text-[18px]' : 'px-4 py-3 text-sm'}`}>{item.item}</td>
                        <td className={`font-bold whitespace-nowrap ${isFullscreen ? 'px-6 py-2 text-[18px]' : 'px-4 py-3 text-sm'}`}>{item.postProc}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white dark:bg-slate-800">
                      <td colSpan="5" className={`text-center text-slate-500 dark:text-slate-400 font-bold ${isFullscreen ? 'py-8 text-[18px]' : 'py-10 text-sm'}`}>현재 대기 중인 작업이 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'banner':
        return (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col w-full h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h2 className="text-lg font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <Flag className="w-5 h-5" />
                게시대 현수막
              </h2>
              <div className="flex items-center gap-3">
                {dashboardStats.availableBannerMonths.length > 0 && (
                  <select 
                    value={bannerMonth} 
                    onChange={e => setBannerMonth(e.target.value)} 
                    className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold outline-none cursor-pointer"
                  >
                    {dashboardStats.availableBannerMonths.map(m => <option key={m} value={m}>{m}월</option>)}
                  </select>
                )}
                <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-sm font-black px-4 py-1.5 rounded-full shadow-sm">
                  {displayBannerList.length}건
                </span>
              </div>
            </div>
            <div className="overflow-auto scroll-smooth flex-1 custom-scrollbar">
              <table className="w-full text-left border-collapse font-bold">
                <thead className="sticky top-0 z-20 shadow-sm">
                  <tr className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <th className="py-3 px-4 whitespace-nowrap">주문일</th>
                    <th className="py-3 px-4 whitespace-nowrap">진행상태</th>
                    <th className="py-3 px-4 whitespace-nowrap">상호</th>
                    <th className="py-3 px-4 whitespace-nowrap">연락처</th>
                    <th className="py-3 px-4 whitespace-nowrap">품목</th>
                    <th className="py-3 px-4 whitespace-nowrap">납기일</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">금액</th>
                    <th className="py-3 px-4 whitespace-nowrap">결제방식</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {displayBannerList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.date}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        <span className={getStatusBadge(item.status)}>{item.status}</span>
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.company}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.contact}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.item}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.deliveryDate}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap">{new Intl.NumberFormat('ko-KR').format(item.sales)}원</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        <span className={getPaymentBadge(item.payment)}>{item.payment}</span>
                      </td>
                    </tr>
                  ))}
                  {displayBannerList.length === 0 && (
                    <tr className="bg-white dark:bg-slate-800">
                      <td colSpan="8" className="text-center text-slate-500 dark:text-slate-400 font-bold py-10 text-sm">해당 월에 등록된 게시대 현수막 내역이 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'lottery':
        return (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col w-full h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h2 className="text-lg font-bold text-fuchsia-600 dark:text-fuchsia-400 flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                추첨대행
              </h2>
              <div className="flex items-center gap-3">
                {dashboardStats.availableLotteryMonths.length > 0 && (
                  <select 
                    value={lotteryMonth} 
                    onChange={e => setLotteryMonth(e.target.value)} 
                    className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold outline-none cursor-pointer"
                  >
                    {dashboardStats.availableLotteryMonths.map(m => <option key={m} value={m}>{m}월</option>)}
                  </select>
                )}
                <span className="bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-800 dark:text-fuchsia-300 text-sm font-black px-4 py-1.5 rounded-full shadow-sm">
                  {displayLotteryList.length}건
                </span>
              </div>
            </div>
            <div className="overflow-auto scroll-smooth flex-1 custom-scrollbar">
              <table className="w-full text-left border-collapse font-bold">
                <thead className="sticky top-0 z-20 shadow-sm">
                  <tr className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <th className="py-3 px-4 whitespace-nowrap">주문일</th>
                    <th className="py-3 px-4 whitespace-nowrap">진행상태</th>
                    <th className="py-3 px-4 whitespace-nowrap">상호</th>
                    <th className="py-3 px-4 whitespace-nowrap">연락처</th>
                    <th className="py-3 px-4 whitespace-nowrap">품목</th>
                    <th className="py-3 px-4 whitespace-nowrap">납기일</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">금액</th>
                    <th className="py-3 px-4 whitespace-nowrap">결제방식</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {displayLotteryList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.date}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        <span className={getStatusBadge(item.status)}>{item.status}</span>
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.company}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.contact}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.item}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.deliveryDate}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap">{new Intl.NumberFormat('ko-KR').format(item.sales)}원</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        <span className={getPaymentBadge(item.payment)}>{item.payment}</span>
                      </td>
                    </tr>
                  ))}
                  {displayLotteryList.length === 0 && (
                    <tr className="bg-white dark:bg-slate-800">
                      <td colSpan="8" className="text-center text-slate-500 dark:text-slate-400 font-bold py-10 text-sm">해당 월에 등록된 추첨대행 내역이 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <style>{`
        html, body { margin: 0 !important; padding: 0 !important; width: 100% !important; height: 100% !important; min-height: 100vh !important; display: block !important; }
        html.dark body { background-color: #0f172a !important; }
        #root { max-width: 100% !important; width: 100% !important; margin: 0 !important; padding: 0 !important; display: block !important; text-align: left !important; }
        .dashboard-container * { transition: background-color 0.2s, border-color 0.2s, color 0.2s; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; }
      `}</style>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans flex flex-col md:flex-row">
        {/* 사이드바 영역 */}
        <div className="w-full md:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0 md:min-h-screen">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 m-0 p-0 leading-none">
              <Package className="text-blue-600 dark:text-blue-400 w-6 h-6" />
              디자인겟 대시보드
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">실시간 연동 데이터 (30초)</p>
          </div>
          <div className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${
                  activeTab === cat.id 
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {cat.icon}
                  {cat.label}
                </div>
                {cat.count !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === cat.id 
                      ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {cat.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 font-bold transition-colors">
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDarkMode ? '라이트모드' : '다크모드'}
            </button>
            <button onClick={() => fetchSheetData(false)} className="w-full flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 font-bold transition-colors">
              <RefreshCcw className="w-4 h-4" />
              새로고침
            </button>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 p-4 md:p-8 flex flex-col h-screen overflow-hidden">
          <div className="w-full max-w-[1400px] mx-auto flex-1 flex flex-col overflow-y-auto custom-scrollbar pb-8 pr-2">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, valueColor = "text-slate-900 dark:text-white", selector }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4 transition-colors">
      <div className={`p-4 rounded-xl ${color}`}>{icon}</div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{title}</p>
          {selector}
        </div>
        <p className={`text-2xl font-bold ${valueColor}`}>
          {new Intl.NumberFormat('ko-KR').format(value)}
          <span className="text-base font-normal text-slate-500 dark:text-slate-400 ml-1">원</span>
        </p>
      </div>
    </div>
  );
}

function MonthlySalesChart({ data }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-400 font-bold">표시할 데이터가 없습니다.</div>;
  }

  const width = 1000;
  const height = 300;
  const padding = { top: 40, right: 60, bottom: 40, left: 80 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map(d => d.sales), 100000);
  const yMax = maxVal * 1.15;

  const getX = (index) => padding.left + (data.length > 1 ? (index / (data.length - 1)) * chartWidth : chartWidth / 2);
  const getY = (val) => padding.top + chartHeight - ((val / yMax) * chartHeight);

  const points = data.map((d, i) => ({
    x: getX(i),
    y: getY(d.sales),
    sales: d.sales,
    month: d.month
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length-1]?.x} ${height - padding.bottom} L ${points[0]?.x} ${height - padding.bottom} Z`;

  return (
    <div className="w-full h-full min-h-[250px] relative flex items-center justify-center">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-h-[350px]">
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
          </linearGradient>
        </defs>

        {[0, 0.33, 0.66, 1].map(ratio => {
          const y = padding.top + chartHeight * ratio;
          const val = yMax * (1 - ratio);
          return (
            <g key={ratio} className="text-slate-400 dark:text-slate-500 text-xs font-bold">
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="currentColor" strokeOpacity="0.15" strokeDasharray="4 4" />
              <text x={padding.left - 15} y={y + 4} textAnchor="end" fill="currentColor">
                {new Intl.NumberFormat('ko-KR', { notation: "compact", maximumFractionDigits: 1 }).format(val)}원
              </text>
            </g>
          );
        })}

        {data.length > 1 && <path d={areaPath} fill="url(#colorSales)" />}
        <path d={linePath} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((p, i) => (
          <g key={i}>
            <text x={p.x} y={height - 15} textAnchor="middle" className="text-slate-500 dark:text-slate-400 text-xs font-bold" fill="currentColor">
              {p.month.replace('-', '. ')}
            </text>

            {hoveredIndex === i && (
              <line x1={p.x} y1={padding.top} x2={p.x} y2={height - padding.bottom} stroke="#4f46e5" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />
            )}

            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === i ? "6" : "4"}
              fill={hoveredIndex === i ? "#ffffff" : "#4f46e5"}
              stroke="#4f46e5"
              strokeWidth="3"
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />

            {hoveredIndex === i && (
              <g className="transition-all duration-200 pointer-events-none">
                <rect
                  x={p.x - 55}
                  y={p.y - 45}
                  width="110"
                  height="30"
                  rx="6"
                  fill="#1e293b"
                  className="dark:fill-slate-700 shadow-xl"
                />
                <text x={p.x} y={p.y - 25} textAnchor="middle" fill="#ffffff" className="text-[13px] font-bold">
                  {new Intl.NumberFormat('ko-KR').format(p.sales)}원
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}