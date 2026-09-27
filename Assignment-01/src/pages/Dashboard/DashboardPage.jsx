import categories from "../../data/categories";
import news from "../../data/news";
import users from "../../data/users";

function DashboardPage() {
    const activeCategories = categories.filter(
        (category) => category.status === 1
    );

    const activeNews = news.filter((item) => item.status === 1);

    const activeUsers = users.filter((user) => user.status === 1);

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Overview of FUNews Management System</p>
            </div>

            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <span className="card-label">Categories</span>
                    <strong>{categories.length}</strong>
                    <small>{activeCategories.length} active</small>
                </div>

                <div className="dashboard-card">
                    <span className="card-label">News</span>
                    <strong>{news.length}</strong>
                    <small>{activeNews.length} active</small>
                </div>

                <div className="dashboard-card">
                    <span className="card-label">Users</span>
                    <strong>{users.length}</strong>
                    <small>{activeUsers.length} active</small>
                </div>

                <div className="dashboard-card">
                    <span className="card-label">Admin Users</span>
                    <strong>
                        {users.filter((user) => user.role === 1).length}
                    </strong>
                    <small>System administrators</small>
                </div>
            </div>

            <div className="dashboard-section">
                <h2>Recent News</h2>

                <div className="dashboard-news-list">
                    {news.slice(0, 4).map((item) => (
                        <div className="dashboard-news-item" key={item.id}>
                            <div>
                                <h3>{item.title}</h3>
                                <p>{item.content}</p>
                            </div>

                            <span
                                className={
                                    item.status === 1
                                        ? "status-badge active"
                                        : "status-badge inactive"
                                }
                            >
                {item.status === 1 ? "Active" : "Inactive"}
              </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;