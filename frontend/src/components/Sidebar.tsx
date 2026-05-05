interface SidebarProps {
  activeTab: 'random' | 'myJokes' | 'addJoke';
  setActiveTab: (tab: 'random' | 'myJokes' | 'addJoke') => void;
  setUser: (user: any) => void;
}

const Sidebar = ({ activeTab, setActiveTab, setUser }: SidebarProps) => {
  return (
    <div className="sidebar-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="joke-svgrepo-com.svg" alt="chuck-norris" className="chuck-img-log-in" />
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-button ${activeTab === 'random' ? 'active' : ''}`}
            onClick={() => setActiveTab('random')}
          >
            RANDOM JOKE
          </button>
          <button
            className={`nav-button ${activeTab === 'myJokes' ? 'active' : ''}`}
            onClick={() => setActiveTab('myJokes')}
          >
            MY JOKES
          </button>
          <button
            className={`nav-button ${activeTab === 'addJoke' ? 'active' : ''}`}
            onClick={() => setActiveTab('addJoke')}
          >
            ADD JOKE
          </button>
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => setUser(null)} className="nav-button">
            LOG OUT
          </button>
          <p className="footer-text">made with Chuck by Chuck - 2026</p>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
