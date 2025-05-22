export type Language = "en" | "ar"

export const translations = {
  en: {
    // Common
    back: "Back",
    save: "Save",
    saving: "Saving...",
    update: "Update",
    delete: "Delete",
    deleting: "Deleting...",
    cancel: "Cancel",
    edit: "Edit",
    details: "Details",
    showMore: "Show More",
    showLess: "Show Less",
    contact: "Contact",
    call: "Call",
    message: "Message",
    total: "Total",
    proceed: "Proceed",
    confirmDelete: "Confirm Delete",

    // Home page
    myProperties: "My Properties",
    addHome: "Add Home",
    noProperties: "You don't have any properties yet.",
    addFirstProperty: "Add Your First Property",

    // Property details
    propertyNotFound: "Property not found. Please return to the home page.",
    goBack: "Go Back",
    address: "Address",
    tenant: "Tenant",
    electricityCode: "Electricity Code",
    rent: "Rent",
    monthly: "Monthly",
    yearly: "Yearly",
    shareholders: "Shareholders/Owners",
    coOwner: "Co-owner",
    peopleShareOwnership: "{count} {count, plural, one {person} other {people}} share ownership of this property",
    deleteProperty: "Delete Property",
    areYouSure: "Are you sure?",
    deleteConfirmation:
      'This action cannot be undone. This will permanently delete the property "{name}" and remove all associated data.',

    // Add/Edit property
    addNewProperty: "Add New Property",
    editProperty: "Edit Property",
    propertyName: "Property Name",
    enterPropertyName: "Enter property name",
    enterAddress: "Enter full address",
    enterElectricityCode: "Enter electricity code",
    tenantName: "Tenant Name",
    enterTenantName: "Enter tenant name",
    rentAmount: "Rent Amount ($)",
    shareholderName: "Shareholder name",
    amount: "Amount",
    callTenant: "Call Tenant",
    invalidRentAmount: "Please enter a valid rent amount",
    failedToSaveHome: "Failed to save property. Please try again.",

    // PWA
    installApp: "Install Home Assistant",
    installAppDescription: "Install this app on your device for quick access even when offline.",
    install: "Install",
    notNow: "Not Now",
    offlineMode: "You are currently offline. Some features may be limited.",

    // Electricity Bills
    bills: "Bills",
    electricityBills: "Electricity Bills",
    addBill: "Add Bill",
    allBills: "All Bills",
    summary: "Summary",
    charts: "Charts",
    yearly: "Yearly",
    noBillsYet: "No electricity bills yet. Add your first bill to get started.",
    viewDetails: "View Details",
    hideDetails: "Hide Details",
    billId: "Bill ID",
    notes: "Notes",
    subscriptionType: "Subscription Type",
    main: "Main",
    motor: "Motor",
    date: "Date",
    totalBills: "Total Bills",
    mainBills: "Main Bills",
    motorBills: "Motor Bills",
    billsOverTime: "Bills Over Time",
    notEnoughData: "Not enough data to display chart. Add more bills.",
    addElectricityBill: "Add Electricity Bill",
    addElectricityBillDescription: "Add a new electricity bill for this property.",
    selectSubscriptionType: "Select subscription type",
    optionalNotes: "Optional notes about this bill",
    dateRange: "Date Range",
    clearFilter: "Clear Filter",
    filtered: "Filtered",
    showingDataFor: "Showing data for",
    noBillsInRange: "No bills found in the selected date range.",

    // Charts
    monthlyBillsOverview: "Monthly Bills Overview",
    allSubscriptionTypes: "All subscription types combined",
    mainBillsTrend: "Main Bills Trend",
    motorBillsTrend: "Motor Bills Trend",
    yearlyDistribution: "Yearly Distribution",
    yearlyDistributionDescription: "Distribution of electricity bills by subscription type",
    notEnoughDataForChart: "Not enough data to display chart. Add more bills.",
    noDataForYear: "No data available for {year}",
    totalSpentInYear: "Total spent in {year}",
    yearlyData: "Yearly Data for {year}",
    type: "Type",
    percentage: "Percentage",
    trendingUpBy: "Trending up by {percentage}% from last year",
    trendingDownBy: "Trending down by {percentage}% from last year",
    comparedToPreviousYear: "Compared to previous year's spending",

    // Bill deletion
    deleteBill: "Delete Bill",
    confirmDeleteBill: "Delete Bill",
    deleteBillConfirmation: "Are you sure you want to delete this bill? This action cannot be undone.",
    deleteBillsInRange: "Delete Bills",
    deleteBillsInRangeDescription: "Select a date range to delete all electricity bills within that period.",
    selectDateRange: "Select Date Range",
    selectDateRangeForDeletion: "Choose the start and end dates for the bills you want to delete.",
    startDate: "Start Date",
    endDate: "End Date",
    selectDateRangeError: "Please select both start and end dates.",
    deleteBillsWarning: "Warning: This will permanently delete all bills within the selected date range.",
    selectedDateRange: "Selected Date Range",
    noBillsInRangeToDelete: "No bills found in the selected date range to delete.",
    deleteBillsError: "An error occurred while deleting bills. Please try again.",
    billsDeleted: "Bills Deleted Successfully",
    billsDeletedDescription: "{count} {count, plural, one {bill was} other {bills were}} successfully deleted.",
  },
  ar: {
    // Common
    back: "رجوع",
    save: "حفظ",
    saving: "جاري الحفظ...",
    update: "تحديث",
    delete: "حذف",
    deleting: "جاري الحذف...",
    cancel: "إلغاء",
    edit: "تعديل",
    details: "تفاصيل",
    showMore: "عرض المزيد",
    showLess: "عرض أقل",
    contact: "اتصال",
    call: "اتصال",
    message: "رسالة",
    total: "المجموع",
    proceed: "متابعة",
    confirmDelete: "تأكيد الحذف",

    // Home page
    myProperties: "عقاراتي",
    addHome: "إضافة عقار",
    noProperties: "ليس لديك أي عقارات حتى الآن.",
    addFirstProperty: "أضف عقارك الأول",

    // Property details
    propertyNotFound: "لم يتم العثور على العقار. يرجى العودة إلى الصفحة الرئيسية.",
    goBack: "رجوع",
    address: "العنوان",
    tenant: "المستأجر",
    electricityCode: "رمز الكهرباء",
    rent: "الإيجار",
    monthly: "شهري",
    yearly: "سنوي",
    shareholders: "المساهمون/المالكون",
    coOwner: "مالك مشارك",
    peopleShareOwnership: "{count} {count, plural, one {شخص يشارك} other {أشخاص يشاركون}} في ملكية هذا العقار",
    deleteProperty: "حذف العقار",
    areYouSure: "هل أنت متأكد؟",
    deleteConfirmation:
      'لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف العقار "{name}" وإزالة جميع البيانات المرتبطة به.',

    // Add/Edit property
    addNewProperty: "إضافة عقار جديد",
    editProperty: "تعديل العقار",
    propertyName: "اسم العقار",
    enterPropertyName: "أدخل اسم العقار",
    enterAddress: "أدخل العنوان الكامل",
    enterElectricityCode: "أدخل رمز الكهرباء",
    tenantName: "اسم المستأجر",
    enterTenantName: "أدخل اسم المستأجر",
    rentAmount: "مبلغ الإيجار ($)",
    shareholderName: "اسم المساهم",
    amount: "المبلغ",
    callTenant: "اتصال بالمستأجر",
    invalidRentAmount: "الرجاء إدخال مبلغ إيجار صحيح",
    failedToSaveHome: "فشل في حفظ العقار. يرجى المحاولة مرة أخرى.",

    // PWA
    installApp: "تثبيت مساعد المنزل",
    installAppDescription: "قم بتثبيت هذا التطبيق على جهازك للوصول السريع حتى عندما تكون غير متصل بالإنترنت.",
    install: "تثبيت",
    notNow: "ليس الآن",
    offlineMode: "أنت حاليا غير متصل بالإنترنت. قد تكون بعض الميزات محدودة.",

    // Electricity Bills
    bills: "الفواتير",
    electricityBills: "فواتير الكهرباء",
    addBill: "إضافة فاتورة",
    allBills: "جميع الفواتير",
    summary: "ملخص",
    charts: "الرسوم البيانية",
    yearly: "سنوي",
    noBillsYet: "لا توجد فواتير كهرباء حتى الآن. أضف أول فاتورة للبدء.",
    viewDetails: "عرض التفاصيل",
    hideDetails: "إخفاء التفاصيل",
    billId: "رقم الفاتورة",
    notes: "ملاحظات",
    subscriptionType: "نوع الاشتراك",
    main: "رئيسي",
    motor: "محرك",
    date: "التاريخ",
    totalBills: "إجمالي الفواتير",
    mainBills: "فواتير رئيسية",
    motorBills: "فواتير محرك",
    billsOverTime: "الفواتير عبر الزمن",
    notEnoughData: "لا توجد بيانات كافية لعرض الرسم البياني. أضف المزيد من الفواتير.",
    addElectricityBill: "إضافة فاتورة كهرباء",
    addElectricityBillDescription: "إضافة فاتورة كهرباء جديدة لهذا العقار.",
    selectSubscriptionType: "اختر نوع الاشتراك",
    optionalNotes: "ملاحظات اختيارية حول هذه الفاتورة",
    dateRange: "نطاق التاريخ",
    clearFilter: "مسح التصفية",
    filtered: "تمت التصفية",
    showingDataFor: "عرض البيانات لـ",
    noBillsInRange: "لا توجد فواتير في نطاق التاريخ المحدد.",

    // Charts
    monthlyBillsOverview: "نظرة عامة على الفواتير الشهرية",
    allSubscriptionTypes: "جميع أنواع الاشتراكات مجتمعة",
    mainBillsTrend: "اتجاه الفواتير الرئيسية",
    motorBillsTrend: "اتجاه فواتير المحرك",
    yearlyDistribution: "التوزيع السنوي",
    yearlyDistributionDescription: "توزيع فواتير الكهرباء حسب نوع الاشتراك",
    notEnoughDataForChart: "لا توجد بيانات كافية لعرض الرسم البياني. أضف المزيد من الفواتير.",
    noDataForYear: "لا توجد بيانات متاحة لعام {year}",
    totalSpentInYear: "إجمالي الإنفاق في عام {year}",
    yearlyData: "بيانات سنوية لعام {year}",
    type: "النوع",
    percentage: "النسبة المئوية",
    trendingUpBy: "ارتفاع بنسبة {percentage}% عن العام الماضي",
    trendingDownBy: "انخفاض بنسبة {percentage}% عن العام الماضي",
    comparedToPreviousYear: "مقارنة بإنفاق العام السابق",

    // Bill deletion
    deleteBill: "حذف الفاتورة",
    confirmDeleteBill: "حذف الفاتورة",
    deleteBillConfirmation: "هل أنت متأكد أنك تريد حذف هذه الفاتورة؟ لا يمكن التراجع عن هذا الإجراء.",
    deleteBillsInRange: "حذف الفواتير",
    deleteBillsInRangeDescription: "حدد نطاق تاريخ لحذف جميع فواتير الكهرباء خلال تلك الفترة.",
    selectDateRange: "حدد نطاق التاريخ",
    selectDateRangeForDeletion: "اختر تواريخ البداية والنهاية للفواتير التي تريد حذفها.",
    startDate: "تاريخ البداية",
    endDate: "تاريخ النهاية",
    selectDateRangeError: "الرجاء تحديد تاريخي البداية والنهاية.",
    deleteBillsWarning: "تحذير: سيؤدي هذا إلى حذف جميع الفواتير ضمن نطاق التاريخ المحدد بشكل دائم.",
    selectedDateRange: "نطاق التاريخ المحدد",
    noBillsInRangeToDelete: "لم يتم العثور على فواتير في نطاق التاريخ المحدد للحذف.",
    deleteBillsError: "حدث خطأ أثناء حذف الفواتير. يرجى المحاولة مرة أخرى.",
    billsDeleted: "تم حذف الفواتير بنجاح",
    billsDeletedDescription: "تم حذف {count} {count, plural, one {فاتورة} other {فواتير}} بنجاح.",
  },
}

export function getTranslation(lang: Language, key: string, params?: Record<string, any>): string {
  const translation = translations[lang][key as keyof (typeof translations)[typeof lang]]

  if (!translation) return key

  if (params) {
    return Object.entries(params).reduce((acc, [key, value]) => {
      // Handle pluralization
      if (key === "count" && typeof value === "number") {
        const pluralMatch = acc.match(new RegExp(`\\{${key}, plural, ([^}]+)\\}`))
        if (pluralMatch) {
          const options = pluralMatch[1].split(" ")
          const pluralForm = value === 1 ? "one" : "other"
          const replacement = options
            .find((opt) => opt.startsWith(`${pluralForm} `))
            ?.split(" ")
            .slice(1)
            .join(" ")
            .replace(/[{}]/g, "")
          return acc.replace(new RegExp(`\\{${key}, plural, [^}]+\\}`), replacement || "")
        }
      }

      return acc.replace(new RegExp(`\\{${key}\\}`, "g"), String(value))
    }, translation as string)
  }

  return translation as string
}
