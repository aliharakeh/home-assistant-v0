import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                // Common
                Cancel: 'Cancel',
                Save: 'Save',
                Amount: 'Amount',
                Amount_PH: 'e.g. 100, 1000',
                Currency: 'Currency',
                Currency_PH: 'e.g. $ , L.L.',
                Name: 'Name',
                Address: 'Address',
                Error: 'Error',
                Loading: 'Loading',
                'Save Changes': 'Save Changes',

                // Home
                Home: 'Home',
                'Property Details': 'Property Details',
                'Edit Property': 'Edit Property',
                'Home Name': 'Home Name',
                'Home Address': 'Address',
                'Home data not found.': 'Home data not found.',
                'Add New Home': 'Add New Home',
                'Create Home': 'Create Home',

                // Rent
                'Rent Details': 'Rent Details',
                Tenant: 'Tenant',
                'Tenant Name': 'Tenant Name',
                'Payment Schedule': 'Payment Schedule',
                'Last Payment Date': 'Last Payment Date',
                Monthly: 'Monthly',
                Yearly: 'Yearly',

                // Electricity
                'Electricity Clock Code': 'Electricity Clock Code',
                'Subscription Types': 'Subscription Types',
                'Add New Electricity Bill': 'Add New Electricity Bill',
                Subscription: 'Subscription',
                'Save Bill': 'Save Bill',

                // Shareholders
                Shareholders: 'Shareholders',
                Shareholder: 'Shareholder',
                Share: 'Share',
                'Shareholder Name': 'Shareholder Name',

                // Form Placeholders
                'e.g., Monthly, Yearly': 'e.g., Monthly, Yearly',
                'e.g., 2024-01-01': 'e.g., 2024-01-01',

                // Form Errors
                'At least one shareholder is required.': 'At least one shareholder is required.',
            },
        },
        ar: {
            translation: {
                // Common
                Cancel: 'إلغاء',
                Save: 'حفظ',
                Amount: 'المبلغ',
                Amount_PH: 'e.g., 100, 1000',
                Currency: 'العملة',
                Currency_PH: 'e.g., $ , L.L.',
                Name: 'الاسم',
                Address: 'العنوان',
                Error: 'خطأ',
                Loading: 'جاري التحميل',
                'Save Changes': 'حفظ التغييرات',

                // Home
                Home: 'المنزل',
                'Property Details': 'تفاصيل العقار',
                'Edit Property': 'تعديل العقار',
                'Home Name': 'اسم المنزل',
                'Home Address': 'عنوان المنزل',
                'Home data not found.': 'لم يتم العثور على بيانات المنزل.',
                'Add New Home': 'إضافة منزل جديد',
                'Create Home': 'إنشاء منزل',

                // Rent
                'Rent Details': 'تفاصيل الإيجار',
                Tenant: 'المستأجر',
                'Tenant Name': 'اسم المستأجر',
                'Rent Amount': 'مبلغ الإيجار',
                'Rent Currency': 'عملة الإيجار',
                'Payment Schedule': 'جدول الدفع',
                'Last Payment Date': 'تاريخ آخر دفعة',
                Monthly: 'شهري',
                Yearly: 'سنوي',

                // Electricity
                'Electricity Clock Code': 'رمز عداد الكهرباء',
                'Subscription Types': 'أنواع الاشتراكات',
                'Add New Electricity Bill': 'إضافة فاتورة كهرباء جديدة',
                Subscription: 'اشتراك',
                'Save Bill': 'حفظ الفاتورة',
                'Clock Code': 'رمز العداد',
                'Electiricity Subscriptions': 'اشتراكات الكهرباء',
                main: 'شركة',

                // Shareholders
                Shareholders: 'المستفيدون',
                Shareholder: 'المستفيد',
                Share: 'الحصة',
                'Shareholder Name': 'اسم المستفيد',

                // Form Placeholders
                'e.g., Monthly, Yearly': 'مثال: شهري، سنوي',
                'e.g., 2024-01-01': 'مثال: 2024-01-01',

                // Form Errors
                'At least one shareholder is required.': 'يجب وجود مساهم واحد على الأقل.',
            },
        },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false, // react already safes from xss
    },
});
