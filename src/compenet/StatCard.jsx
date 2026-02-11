const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-white p-6 rounded-xl border border-[#90b4ce]/20 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg bg-opacity-10`} style={{ backgroundColor: `${color}15` }}>
        <Icon size={24} style={{ color: color }} />
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.includes('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-[#5f6c7b] text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-[#094067] mt-1">{value}</h3>
    </div>
  </div>
);
export default StatCard;