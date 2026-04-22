import { motion } from 'motion/react';

export default function TeamSection() {
  const coreTeam = [
    { role: 'Ketua', name: 'Zulkifli, S.Si (Bang Zoel)' },
    { role: 'Sekretaris', name: 'Dewi Cahyanti, S.Si., S.Pd' },
    { role: 'Bendahara', name: 'Ai Suryani, S.P., S.Pd' },
    { role: 'Direktur Program', name: 'Ahmad Saeful, S.Pd' },
    { role: 'Kabid Sosial', name: 'Mochammad Sachroni, S.Fil.I' },
    { role: 'Creative Event', name: 'Dicky Ramdhani' },
    { role: 'Direktur Pembinaan', name: 'Ardi Hermawan' },
  ];

  const advisors = [
    'Ust Dr. Suparman Jasin, M.Ag',
    'Ust Muhammad Yunus, S.T',
    'Hasan Nurdin, S.Pd',
  ];

  return (
    <section id="tim" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Tim Inti Mushaff Indonesia</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Didukung oleh tim profesional dan relawan muda yang berdedikasi.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {coreTeam.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 text-center group hover:bg-white hover:shadow-xl transition-all"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center text-primary font-bold text-2xl group-hover:bg-primary group-hover:text-white transition-colors">
                {member.name.charAt(0)}
              </div>
              <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">{member.role}</div>
              <h4 className="text-lg font-bold text-slate-900">{member.name}</h4>
            </motion.div>
          ))}
        </div>

        <div className="bg-primary/5 rounded-[3rem] p-12 lg:p-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-slate-900">Dewan Pembina & Pengawas</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {advisors.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm text-center font-bold text-slate-700"
              >
                {name}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
