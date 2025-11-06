import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Star } from 'lucide-react';
import PropTypes from 'prop-types';

const FeatureItem = ({ feature }) => (
  <li className="group flex items-start space-x-3 p-2.5 md:p-3.5 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10">
    <div className="relative mt-2">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-blue-600/20 rounded-full blur group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
      <div className="relative w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-400 group-hover:scale-125 transition-transform duration-300" />
    </div>
    <span className="text-sm md:text-base text-gray-300 group-hover:text-white transition-colors">{feature}</span>
  </li>
);

FeatureItem.propTypes = {
  feature: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

const InternshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [intern, setIntern] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = JSON.parse(localStorage.getItem('internships')) || [];
    const found = stored.find((r) => String(r.id) === String(id));
    if (found) setIntern(found);
  }, [id]);

  if (!intern) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-white">Loading Internship...</h2>
        </div>
      </div>
    );
  }

  const formatDate = (d) => {
    if (!d) return '';
    try { return new Date(d).toLocaleDateString(); } catch { return d; }
  };

  const openProject = () => {
    if (intern.project_link) {
      window.open(intern.project_link, '_blank');
    } else if (intern.project_id) {
      navigate(`/project/${intern.project_id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] px-[2%] sm:px-0 relative overflow-hidden">
      <div className="fixed inset-0">
        <div className="absolute -inset-[10px] opacity-20">
          <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
          <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-12 animate-fadeIn">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center space-x-1.5 md:space-x-2 px-3 md:px-5 py-2 md:py-2.5 bg-white/5 backdrop-blur-xl rounded-xl text-white/90 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-base text-white/50">
              <span>Internships</span>
              <svg className="w-3 h-3 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              <span className="text-white/90 truncate">{intern.title}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
            <div className="space-y-6 md:space-y-10 animate-slideInLeft">
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-blue-200 via-blue-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                  {intern.title}
                </h1>
                <div className="relative h-1 w-16 md:w-24">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full blur-sm" />
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-base md:text-lg text-gray-300/90 leading-relaxed">
                  {intern.description}
                </p>
              </div>

              

              <div className="space-y-4 md:space-y-6">
                <h3 className="text-lg md:text-xl font-semibold text-white/90 mt-[3rem] md:mt-0 flex items-center gap-2 md:gap-3">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                  What I worked on
                </h3>
                {intern.tasks ? (
                  <ul className="list-none space-y-2">
                    {Array.isArray(intern.tasks) ? (
                      intern.tasks.map((t, i) => <FeatureItem key={i} feature={t} />)
                    ) : (
                      <FeatureItem feature={intern.tasks} />
                    )}
                  </ul>
                ) : (
                  <p className="text-sm md:text-base text-gray-400 opacity-50">No tasks listed.</p>
                )}
              </div>
            </div>

            <div className="space-y-6 md:space-y-10 animate-slideInRight">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {intern.logo_url ? (
                  <img src={intern.logo_url} alt={intern.enterprise} className="w-full object-contain max-h-96 p-8 bg-[#030014]" loading="lazy" />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-white/3">{intern.enterprise}</div>
                )}
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-300 rounded-2xl" />
              </div>

              <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-6 hover:border-white/20 transition-colors duration-300 group">
                <h3 className="text-xl font-semibold text-white/90 flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Internship Details
                </h3>
                <div className="text-sm text-gray-300">
                  <div><strong>Company:</strong> {intern.enterprise}</div>
                  <div className="mt-2"><strong>Period:</strong> {formatDate(intern.start_date)}{intern.end_date ? ` — ${formatDate(intern.end_date)}` : ''}</div>
                </div>
                <div className="flex flex-wrap gap-3">
                {(intern.project_id || intern.project_link) && (
                  <button onClick={openProject} className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-gradient-to-r from-blue-600/10 to-blue-600/10 hover:from-blue-600/20 hover:to-blue-600/20 text-blue-300 rounded-xl transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40 backdrop-blur-xl overflow-hidden text-sm md:text-base">
                    <ExternalLink className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                    <span className="relative font-medium">View linked project</span>
                  </button>
                )}

                {intern.certificate_url && (
                  <a href={intern.certificate_url} target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-gradient-to-r from-blue-600/10 to-pink-600/10 hover:from-blue-600/20 hover:to-pink-600/20 text-blue-300 rounded-xl transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40 backdrop-blur-xl overflow-hidden text-sm md:text-base">
                    <ExternalLink className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                    <span className="relative font-medium">View Certificate</span>
                  </a>
                )}
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`\n        @keyframes blob {\n          0% { transform: translate(0px, 0px) scale(1); }\n          33% { transform: translate(30px, -50px) scale(1.1); }\n          66% { transform: translate(-20px, 20px) scale(0.9); }\n          100% { transform: translate(0px, 0px) scale(1); }\n        }\n        .animate-blob { animation: blob 10s infinite; }\n        .animation-delay-2000 { animation-delay: 2s; }\n        .animation-delay-4000 { animation-delay: 4s; }\n        .animate-fadeIn { animation: fadeIn 0.7s ease-out; }\n        .animate-slideInLeft { animation: slideInLeft 0.7s ease-out; }\n        .animate-slideInRight { animation: slideInRight 0.7s ease-out; }\n        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }\n        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px);} to { opacity:1; transform: translateX(0);} }\n        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px);} to { opacity:1; transform: translateX(0);} }\n      `}</style>
    </div>
  );
};

export default InternshipDetail;
