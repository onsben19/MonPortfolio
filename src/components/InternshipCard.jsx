import PropTypes from 'prop-types';
const InternshipCard = ({ id, Title, Enterprise, StartDate, EndDate, Logo }) => {
  const formatDate = (d) => {
    if (!d) return '';
    try { return new Date(d).toLocaleDateString(); } catch { return d; }
  }
  const detailsHref = `/internship/${id}`;

  return (
    <div className="p-4 rounded-2xl bg-slate-800/40 backdrop-blur-sm border border-white/6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4">
        {Logo ? (
          <img src={Logo} alt={`${Enterprise} logo`} className="h-20 w-20 object-contain rounded-md" />
        ) : (
          <div className="h-20 w-20 rounded-md bg-gradient-to-r from-blue-600 to-blue-600 flex items-center justify-center text-white font-bold">{Enterprise?.[0] || 'E'}</div>
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-base">{Title}</h3>
              <p className="text-slate-300 text-sm mt-1 font-medium">{Enterprise}</p>
            </div>
            <span className="text-sm text-slate-400">{formatDate(StartDate)}{EndDate ? ` — ${formatDate(EndDate)}` : ''}</span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <a href={detailsHref} className="inline-flex items-center px-3 py-2 bg-white/5 hover:bg-white/10 rounded-md text-sm text-white transition">Details</a>
        </div>
      </div>
    </div>
  );
};

InternshipCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  Title: PropTypes.string,
  Enterprise: PropTypes.string,
  StartDate: PropTypes.string,
  EndDate: PropTypes.string,
  Logo: PropTypes.string,
};

export default InternshipCard;
