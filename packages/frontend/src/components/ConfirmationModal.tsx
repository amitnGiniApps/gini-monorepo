import { useQuestionnaireStore } from "../store/useQuestionnaireStore";

export default function ConfirmationModal({ formData, onConfirm }: { formData: any, onConfirm: () => void }) {
    const { setShowConfirmation } = useQuestionnaireStore();

    return (
        <div className="confirmation-modal">
            <div className="modal-content">
                <h2>Are you sure you want to submit?</h2>
                <pre>{JSON.stringify(formData, null, 2)}</pre>
                <div className="modal-buttons">
                    <button type="button" onClick={onConfirm} className="btn submit">
                        Confirm Submit
                    </button>
                    <button type="button" onClick={() => setShowConfirmation(false)} className="btn secondary">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
