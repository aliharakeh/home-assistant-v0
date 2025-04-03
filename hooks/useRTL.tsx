import { useTranslation } from 'react-i18next';

export function useRTL() {
    const { i18n } = useTranslation();

    if (i18n.language === 'ar') {
        return {
            containerRTL: 'flex-row-reverse',
            textRTL: 'text-right',
            columnContainerRTL: 'flex-col-reverse',
        };
    }
    return { containerRTL: '', textRTL: '', columnContainerRTL: '' };
}
