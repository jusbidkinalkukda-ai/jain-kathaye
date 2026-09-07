import { Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsView: React.FC = () => {
  const { openReader } = useApp();

  const notifications = [
    {
      id: '1',
      type: 'sutra',
      title: 'आज का जिनवाणी सूत्र (Daily Sutra)',
      desc: '"परस्परोपग्रहो जीवानाम्" — संसार के समस्त प्राणी परस्पर एक-दूसरे के उपकारक हैं। सभी जीवों के प्रति आदर व करुणा रखें।',
      time: 'आज प्रातः काल',
      isNew: true,
      actionBookId: 'mahavira-charitra',
    },
    {
      id: '2',
      type: 'audio',
      title: 'नई ऑडियो गाथा उपलब्ध',
      desc: '"भगवान पार्श्वनाथ व कमठ का वैर" का संपूर्ण वाचन अब उपलब्ध है। यात्रा के समय भी श्रवण करें।',
      time: 'कल',
      isNew: true,
      actionBookId: 'parshvanath-kamath',
    },
    {
      id: '3',
      type: 'parva',
      title: 'आगामी स्वाध्याय पर्व',
      desc: 'पाक्षिक अष्टमी व चतुर्दशी को मौन स्वाध्याय का संकल्प लें। आत्म-शुद्धि का उत्तम अवसर।',
      time: '3 दिन पूर्व',
      isNew: false,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 pb-24 md:pb-12">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-jain-text flex items-center gap-2">
            <Bell className="w-5 h-5 text-jain-maroon" />
            <span>धर्म संदेश व सूचनाएं</span>
          </h2>
          <p className="text-xs text-jain-muted mt-0.5">
            जिनवाणी सूत्र, पर्व तिथियाँ एवं वाचनालय के नवीनतम अपडेट
          </p>
        </div>
        <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full border border-red-200">
          2 नए संदेश
        </span>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-3xl border transition-all ${
              n.isNew
                ? 'bg-white border-jain-gold/50 shadow-jain-card'
                : 'bg-jain-cream-light/60 border-jain-border'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {n.type === 'sutra' ? '🌸' : n.type === 'audio' ? '🎧' : '📅'}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-jain-text">
                  {n.title}
                </h3>
              </div>
              <span className="text-[10px] text-jain-muted font-medium shrink-0">
                {n.time}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-jain-muted leading-relaxed pl-7">
              {n.desc}
            </p>

            {n.actionBookId && (
              <div className="mt-3 pl-7">
                <button
                  onClick={() => openReader(n.actionBookId)}
                  className="text-xs font-bold text-jain-maroon hover:underline flex items-center gap-1"
                >
                  <span>कथा पढ़ें व सुनें</span>
                  <span>➔</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
