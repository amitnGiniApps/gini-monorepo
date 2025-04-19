import { create } from 'zustand';

interface QuestionnaireStore {
    step: number;
    showConfirmation: boolean;
    submit: boolean;
    loading: boolean;
    htmlContent: string | null;
    nextStep: () => void;
    prevStep: () => void;
    setShowConfirmation: (value: boolean) => void;
    setSubmit: (value: boolean) => void;
    setLoading: (value: boolean) => void;
    setHtmlContent: (html: string | null) => void;
    reset: () => void;
}

export const useQuestionnaireStore = create<QuestionnaireStore>((set) => ({
    step: 0,
    showConfirmation: false,
    submit: false,
    loading: false,
    htmlContent: null,
    nextStep: () => set((state) => ({ step: state.step + 1 })),
    prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 0) })),
    setShowConfirmation: (value) => set({ showConfirmation: value }),
    setSubmit: (value) => set({ submit: value }),
    setLoading: (value) => set({ loading: value }),
    setHtmlContent: (html) => set({ htmlContent: html }),
    reset: () => set({
        step: 0,
        showConfirmation: false,
        submit: false,
        loading: false,
        htmlContent: null
    }),
}));
