interface AnnouncementBarProps {
    settings: {
        active: boolean;
        message: string;
        bgColor: string;
    };
}

export default function AnnouncementBar({ settings }: AnnouncementBarProps) {
    if (!settings.active) return null;

    return (
        <div
            className="w-full py-2.5 transition-colors duration-300"
            style={{ backgroundColor: settings.bgColor }}
            role="banner"
            aria-label="Informações de benefícios"
        >
            <p className="text-white text-xs md:text-sm font-medium tracking-wide text-center px-4">
                {settings.message}
            </p>
        </div>
    );
}
