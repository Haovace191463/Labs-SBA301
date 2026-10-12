import { Link, NavLink } from 'react-router-dom'

export default function NavBar() {
  return (
    <header className="topbar">
      <Link className="brand" to="/" aria-label="Orchid Management V5 trang chủ">
        <span className="brand__mark" aria-hidden="true">✿</span>
        <span>Orchid_Mgnt_<span className="brand__light">V5</span></span>
      </Link>

      <nav aria-label="Chính" className="navbar-nav">
        <div className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
          >
            📋 Danh sách (List)
          </NavLink>
          <NavLink
            to="/orchids/new"
            className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
          >
            ＋ Thêm hoa lan (Create)
          </NavLink>
        </div>
      </nav>

      <div className="topbar__right">
        <span className="connection-indicator"><i /> SPA Connected</span>
        <span className="avatar" aria-label="Tài khoản">V5</span>
      </div>
    </header>
  )
}
