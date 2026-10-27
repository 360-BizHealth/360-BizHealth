/* Line icons for the dashboard (24px grid, currentColor, decorative). */
const P = {
  dashboard: <><rect x="3.5" y="3.5" width="7" height="8" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="5" rx="1.5" /><rect x="13.5" y="11.5" width="7" height="9" rx="1.5" /><rect x="3.5" y="14.5" width="7" height="6" rx="1.5" /></>,
  leads: <><circle cx="9" cy="8" r="3.2" /><path d="M3 19.5c.7-3.4 3.1-5.3 6-5.3s5.3 1.9 6 5.3" /><path d="M16 5.2a3 3 0 0 1 0 5.6M18 14.6c1.5.7 2.6 2.4 3 4.9" /></>,
  inbox: <><path d="M3.5 13.5 6 5h12l2.5 8.5V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19z" /><path d="M3.5 13.5H8l1.5 2.5h5l1.5-2.5h4.5" /></>,
  blog: <><path d="M5 4.5h10l4 4V19.5H5z" /><path d="M15 4.5v4h4M8.5 12h7M8.5 15.5h7M8.5 8.5h3" /></>,
  retreat: <><path d="M3 19.5 9.5 8l4 7 2.5-4 5 8.5z" /><circle cx="17" cy="6" r="2" /></>,
  users: <><rect x="4" y="10.5" width="16" height="10" rx="2" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.5v2.5" /></>,
  external: <><path d="M14 4.5h5.5V10M19.5 4.5 11 13M17.5 14v4.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5V8.5A1.5 1.5 0 0 1 6 7h4.5" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="M6 6l12 12M18 6 6 18" /></>,
  collapse: <><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><path d="M9 4.5v15M15.5 10l-2 2 2 2" /></>,
  expand: <><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><path d="M9 4.5v15M13.5 10l2 2-2 2" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  refresh: <><path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4" /></>,
  download: <><path d="M12 4.5v11M7.5 11l4.5 4.5 4.5-4.5M5 19.5h14" /></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  eye: <><path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>,
  edit: <><path d="M4.5 19.5 5 16 15.5 5.5a2.1 2.1 0 0 1 3 3L8 19z" /></>,
  trash: <><path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 12.5h9l1-12.5" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  check: <><path d="m5 12.5 4.5 4.5L19 7.5" /></>,
  image: <><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="m4 18 5.5-5 4 3.5 2.5-2 4 3.5" /></>,
};

export default function Icon({ name, size = 20 }) {
  return (
    <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {P[name]}
    </svg>
  );
}
