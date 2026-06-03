import React, {
	createContext,
	useCallback,
	useContext,
	useState,
} from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
	id: number;
	message: string;
	type: ToastType;
}

interface ToastContextType {
	showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let nextId = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const showToast = useCallback((message: string, type: ToastType = "info") => {
		const id = ++nextId;
		setToasts((prev) => [...prev, { id, message, type }]);
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		}, 3000);
	}, []);

	const dismiss = (id: number) =>
		setToasts((prev) => prev.filter((t) => t.id !== id));

	const bgColor: Record<ToastType, string> = {
		success: "bg-green-600",
		error: "bg-red-600",
		info: "bg-blue-600",
	};

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
				{toasts.map((t) => (
					<div
						key={t.id}
						className={`${bgColor[t.type]} text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 min-w-[220px] animate-fade-in`}
					>
						<span className="flex-1 text-sm font-medium">{t.message}</span>
						<button
							onClick={() => dismiss(t.id)}
							className="text-white/80 hover:text-white text-lg leading-none"
						>
							&times;
						</button>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error("useToast must be used within ToastProvider");
	return ctx;
};
