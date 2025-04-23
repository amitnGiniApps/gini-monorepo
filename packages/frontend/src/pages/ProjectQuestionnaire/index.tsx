import { FormProvider, useForm } from "react-hook-form";
import { projectQuestionnaire } from "../../constant";
import {useQuestionnaireStore} from "../../store/useQuestionnaireStore.ts";
import ConfirmationModal from "../../components/ConfirmationModal.tsx";
import FormFieldRenderer from "../../components/FormFieldRenderer.tsx";
import './index.css';

export default function ProjectQuestionnaire() {
    const methods = useForm();
    const formData = methods.watch();

    const {
        step,
        showConfirmation,
        submit,
        loading,
        htmlContent,
        nextStep,
        prevStep,
        setShowConfirmation,
        setSubmit,
        setLoading,
        setHtmlContent,
    } = useQuestionnaireStore();

    const currentField = projectQuestionnaire[step];
    const isRepeaterStep = currentField.type === "repeater";

    const onSubmit = async (data: any) => {
        setLoading(true);
        setSubmit(true);
        setHtmlContent(null);

        try {
            const response = await fetch("http://localhost:3000/api/v1/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const html = await response.text();
                setHtmlContent(html);
            } else {
                console.error("Error fetching HTML", response);
            }
        } catch (error) {
            console.error("Failed to generate HTML", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalSubmit = () => methods.handleSubmit(onSubmit)();

    if (submit) {
        return (
            <>
                {loading && <div className="spinner">Loading...</div>}
                {htmlContent && (
                    <iframe
                        title="Generated HTML"
                        srcDoc={htmlContent}
                        style={{
                            width: "100%",
                            height: "600px",
                            border: "1px solid #ccc",
                            marginTop: "2rem",
                            borderRadius: "8px",
                        }}
                    />
                )}
            </>
        );
    }

    return (
        <FormProvider {...methods}>
            <form className="questionnaire-form" onSubmit={methods.handleSubmit(onSubmit)}>
                {showConfirmation ? (
                    <ConfirmationModal formData={formData} onConfirm={handleFinalSubmit} />
                ) : (
                    <>
                        <FormFieldRenderer field={currentField} />
                        <div className="nav-buttons">
                            {step > 0 && (
                                <button type="button" onClick={prevStep} className="btn secondary">
                                    Previous
                                </button>
                            )}
                            {step < projectQuestionnaire.length - 1 && !isRepeaterStep ? (
                                <button type="button" onClick={nextStep} className="btn">
                                    Next
                                </button>
                            ) : isRepeaterStep ? (
                                <button type="button" onClick={() => setShowConfirmation(true)} className="btn">
                                    Next (to submit)
                                </button>
                            ) : (
                                <button type="submit" className="btn submit">
                                    Submit
                                </button>
                            )}
                        </div>
                    </>
                )}
            </form>
        </FormProvider>
    );
}
