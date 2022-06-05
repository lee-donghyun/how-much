import { CalendarOutlined, LineChartOutlined } from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div>
      <Outlet />
      <div className="bottom-navigation">
        <button
          className={pathname == "/" ? "active" : ""}
          onClick={() => {
            navigate("/", { replace: true });
          }}
        >
          <CalendarOutlined style={{ fontSize: "18px" }} />
          <p>캘린더</p>
        </button>
        <button
          className={pathname == "/stastics" ? "active" : ""}
          onClick={() => {
            navigate("/stastics", { replace: true });
          }}
        >
          <LineChartOutlined style={{ fontSize: "18px" }} />
          <p>통계</p>
        </button>
      </div>
    </div>
  );
};

export default Navigation;
